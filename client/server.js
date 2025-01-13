import jsonServer from "json-server";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const googleClient = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post("/api/auth/google", async (req, res) => {
  try {
    const { token, userInfo } = req.body;

    if (!token) {
      return res.status(400).jsonp({
        status: "error",
        message: "Token is required",
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const { email, name } = userInfo;

    // Get users from database
    const users = router.db.get("users");

    // Check if user exists
    let user = users.find({ email: email }).value();

    if (!user) {
      // Create new user if doesn't exist
      user = {
        id: uuidv4(),
        email: email,
        name: name,
        createdAt: new Date().toISOString(),
      };

      // Save to database
      users.push(user).write();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.VITE_JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.jsonp({
      status: "success",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token: jwtToken,
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).jsonp({
      status: "error",
      message: "Authentication failed",
    });
  }
});

// Add custom routes before JSON Server router
server.post("/api/auth/signup   ", (req, res) => {
  const users = router.db.get("users");
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).jsonp({
      status: "error",
      message: "Invalid input. Email and password are required.",
    });
  }

  // Check if email already exists
  const existingUser = users.find({ email }).value();
  if (existingUser) {
    return res.status(400).jsonp({
      status: "error",
      message: "Email already exists.",
    });
  }

  const user = {
    id: Date.now().toString(),
    email,
    password,
    token: `fake-jwt-token-${Date.now()}`,
  };

  users.push(user).write();

  // Return response without password
  const { password: _, ...userWithoutPassword } = user;
  res.jsonp({
    status: "success",
    message: "User registered successfully.",
    user: userWithoutPassword,
    token: user.token,
  });
});

server.post("/api/auth/signin", (req, res) => {
  const users = router.db.get("users").value();
  const user = users.find(
    (u) => u.email === req.body.email && u.password === req.body.password
  );

  if (user) {
    res.jsonp({
      status: "success",
      message: "Login successful",
      user,
      token: user.token,
    });
  } else {
    res.status(400).jsonp({
      status: "error",
      message: "Invalid credentials",
    });
  }
});

server.post("/api/documents/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).jsonp({
        status: "error",
        message: "No file uploaded",
      });
    }
    console.log(req.body);
    const fileDoc = {
      id: Date.now().toString(),
      fileName: req.file.originalname,
      path: req.file.path,
      uploadedAt: new Date().toISOString(),
      userId: req.body.userId,
    };

    // Add file record to db.json
    const files = router.db.get("files");
    files.push(fileDoc).write();

    res.jsonp({
      status: "success",
      message: "File uploaded successfully",
      fileId: fileDoc.id,
      fileName: fileDoc.fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).jsonp({
      status: "error",
      message: "File upload failed",
    });
  }
});

server.get("/api/documents", (req, res) => {
  console.log("rerer", req.query.userId);
  const files = router.db.get("files").filter({ userId: req.query.userId });
  res.jsonp(files.value());
});

server.post("/api/chat", (req, res) => {
  try {
    const { query } = req.body;

    // Validate input
    if (!query) {
      return res.status(400).jsonp({
        status: "error",
        message: "Query is required.",
      });
    }

    // Here you would typically integrate with an AI service
    // For now, let's send a mock response
    const mockResponses = {
      hello: "Hi there! How can I help you today?",
      "how are you":
        "I'm doing well, thank you for asking! How can I assist you?",
      default:
        "I understand you said: " + query + ". How can I help you with that?",
    };

    const responseText =
      mockResponses[query.toLowerCase()] || mockResponses.default;

    res.jsonp({
      status: "success",
      responseText: responseText,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).jsonp({
      status: "error",
      message: "Unable to process the query.",
    });
  }
});

// Use default router
server.use("/api", router);

// Start server
const port = 8000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
