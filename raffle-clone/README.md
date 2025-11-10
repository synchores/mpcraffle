# Raffle Clone

## Overview
This project is a raffle application that allows users to add participants with probability weights and prizes to draw. It features a user-friendly interface and utilizes JavaScript SDKs for data management and UI interactions.

## Project Structure
```
raffle-clone
├── public
│   ├── index.html          # HTML structure of the raffle application
│   └── _sdk
│       ├── data_sdk.js     # SDK for data operations
│       └── element_sdk.js   # SDK for UI element management
├── src
│   ├── app.js              # Main application logic
│   └── utils.js            # Utility functions
├── server.js                # Backend server setup
├── package.json             # npm configuration file
├── .gitignore               # Git ignore file
└── README.md                # Project documentation
```

## Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd raffle-clone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the server:**
   ```bash
   node server.js
   ```

4. **Open the application:**
   Navigate to `http://localhost:3000` in your web browser.

## Usage Guidelines
- Add participants by entering their name and weight in the designated fields.
- Add prizes by entering the prize name.
- Click the "Draw Winner" button to randomly select a winner based on the weights assigned to participants.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.