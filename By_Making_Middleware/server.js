const express = require('express');
const authRoutes = require('./router.js');

const app = express();

app.use('/api', authRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
