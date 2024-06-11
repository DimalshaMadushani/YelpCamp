Here's a complete README file for your YelpCamp project on GitHub:

---

# YelpCamp

YelpCamp is a full-stack web application for sharing and reviewing campgrounds. Users can create accounts, add campgrounds, leave reviews, and interact with other users. This project uses Node.js, Express, MongoDB, and various other technologies to create a dynamic and engaging experience.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **User Authentication and Authorization**: 
  - Users can register, log in, and log out.
  - Authentication is handled using Passport.js.
  - Authorization ensures only the owners can edit or delete their campgrounds and reviews.

- **Campground Management**: 
  - Users can create, edit, and delete campgrounds.
  - Each campground can have a title, image, description, and location.
  - Integration with Mapbox for displaying campground locations on a map.

- **Review System**: 
  - Users can leave reviews and ratings for campgrounds.
  - Reviews can be edited or deleted by the user who created them.
  - Average rating is calculated and displayed for each campground.

- **Image Upload**: 
  - Users can upload images for campgrounds using Cloudinary.
  - Multiple images can be uploaded for a single campground.
  - Images are stored and served securely.

- **Responsive Design**: 
  - The application is designed to be fully responsive, ensuring a good user experience on both desktop and mobile devices.
  - Uses Bootstrap for styling and layout.

## Installation

### Prerequisites
- Node.js and npm installed
- MongoDB installed and running

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/DimalshaMadushani/YelpCamp.git
   cd YelpCamp
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   DATABASE_URL=<your_mongo_db_url>
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
   CLOUDINARY_KEY=<your_cloudinary_key>
   CLOUDINARY_SECRET=<your_cloudinary_secret>
   ```

4. Seed the database (optional):
   ```sh
   node seeds/index.js
   ```

5. Start the application:
   ```sh
   npm start
   ```

6. Visit `http://localhost:3000` in your browser.

## Usage

1. **Register and Log In**: 
   - Visit the registration page to create an account.
   - Log in using your credentials to access all features.

2. **Browse Campgrounds**: 
   - View a list of all campgrounds on the home page.
   - Click on a campground to see detailed information, including reviews and location.

3. **Add a Campground**: 
   - Click on "Add New Campground" to create a new campground.
   - Fill in the form with the title, description, location, and upload images.

4. **Edit and Delete Campgrounds**: 
   - If you are the owner of a campground, you can edit or delete it.
   - Use the "Edit" button on the campground page to update details or the "Delete" button to remove it.

5. **Leave Reviews**: 
   - On a campground’s page, scroll to the reviews section.
   - Click "Add Review" to write a new review and provide a rating.
   - Edit or delete your reviews if needed.

6. **Map Integration**: 
   - View the location of campgrounds on an interactive map.
   - Use the map to find campgrounds in specific areas.

By providing detailed descriptions of features and usage, users can better understand how to interact with your YelpCamp application.

## Technologies
- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS
- Passport.js
- Cloudinary
- Bootstrap
- Mapbox

## Project Structure
- `app.js`: Main application file
- `controllers/`: Route handlers
- `models/`: Mongoose models
- `routes/`: Application routes
- `views/`: EJS templates
- `public/`: Static files (CSS, JS, images)
- `seeds/`: Database seeding scripts
- `utils/`: Utility functions

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```sh
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```sh
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
Dimalsha Madushani - [My Email](mailto:madushaniagd@gmail.com)

Project Link: [YelpCamp](https://github.com/DimalshaMadushani/YelpCamp)

---
