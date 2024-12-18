
# POLICE DATABASE

## Subtitle: Police Database using Node.js, MongoDB, Discord Webhooks, PDFKIT ,and Unb-API

### Description
**Police Database** is a fictional project designed to serve as a comprehensive database for managing and storing information about pedestrians. Built with **Node.js** and **MongoDB**, it allows you to easily collect data about individuals, including personal records, traffic infractions, and criminal history. The database also includes features for submitting arrest records and issuing driving tickets.

This project integrates with **Discord webhooks** for notifications and leverages the **Unb-API** to enhance functionality related to user information and administrative actions.

This is a basic example, you can add more information. remember, the design of the page is too simple bc it's just an example.
---

### Features
- **Comprehensive Pedestrian Information**: Collect and organize personal data about pedestrians for quick access.
- **Arrest Records**: Submit and store arrest information directly in the database.
- **Driver Tickets**: Issue and save tickets for traffic violations, making them easily accessible for reference.
- **Discord Webhooks Integration**: Send automated updates and alerts directly to your Discord server, making it easy to track and monitor records in real time.
- **Unb-API Support**: Utilize Unb-API features to manage and verify additional information about users when needed.

### Technologies Used
- **Node.js**: A JavaScript runtime environment for server-side programming.
- **MongoDB**: A NoSQL database that stores data in flexible, JSON-like documents.
- **PDFKIT**: A PDF library, that'll create the pdf documents for all arrest and trafic ticket report. 


---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/police-database.git
   cd police-database
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Set up your environment variables by creating a `.env` file in the root directory.
   ```bash
    MONGODB_URI
    PORT
    SESSION_PASSWORD
    RECORD_WEBHOOK
    TICKET_WEBHOOK
    UNB_API_TOKEN
    GUILD_ID
    ```
   
3. **schemas**:
   add and modify the schemas and set yours, you can add and modify all funcionality in the db to add or remove information

4. **ajust bot / page / general db**:
   if you want to use your information you need to set a bot or other page where you can save ids, vehicles etc, that bc the page just save records and tickets. 

5. **Run the server**:
   ```bash
   npm start
   ```

---

### Usage

- **Submit Arrests**: Through the API, submit arrest records which are instantly saved in the MongoDB database.
- **Issue Tickets**: Submit driver tickets for various infractions.
- **Receive Discord Notifications**: Get real-time updates on arrests and tickets directly in your Discord channel via webhooks.

---

### Contributing
This project is open for contributions. Feel free to fork the repository, make changes, and submit a pull request.

---

### License
This project is for educational purposes. 

**Private use**: you don't need any mark or copyright sign
**Public use**: add my github username/link or repository link

--- 

### Disclaimer
This is a fictional project intended for educational and development purposes only. It is not designed for use in real-world law enforcement or database management.
macondo is a fictional town in "100 años de soledad- Gabriel Garcia Marquez".


--- 


