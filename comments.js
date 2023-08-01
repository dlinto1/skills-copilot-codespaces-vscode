// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

// Create web server
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create a database
const commentsByPostId = {};

// Create routes
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});
app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  // Get post id from url
  const { id } = req.params;
  // Get comment from body
  const { content } = req.body;
  // Get comments from database
  const comments = commentsByPostId[id] || [];
  // Add new comment to the database
  comments.push({ id: commentId, content, status: 'pending' });
  // Save comments to the database
  commentsByPostId[id] = comments;
  // Send event to event bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: { id: commentId, content, postId: id, status: 'pending' },
  });
  // Send response
  res.status(201).send(comments);
});
app.post('/events', async (req, res) => {
  console.log('Event Received:', req.body.type);
  // Get event type
  const { type, data } = req.body;
  // Check if event type is CommentModerated
  if (type === 'CommentModerated') {
    // Get comment from the database
    const { id, postId, status, content } = data;
    // Get comments from the database
    const comments = commentsByPostId[postId];
    // Get comment from the database
    const comment = comments.find((comment) => comment.id === id);
    // Update comment status
    comment.status = status;
    // Send event to event bus
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: { id, postId, status, content },
    });
  }
  // Send response
  res.send
});