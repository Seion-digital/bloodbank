# Blood Bank Dashboard App

This is a comprehensive blood bank dashboard application designed to connect blood donors with those in need. The platform facilitates blood requests, donor search, and communication, streamlining the process of blood donation and saving lives.

## Features

### Core Features

- **User Authentication:** Secure user registration and login system.
- **Dashboard:** A personalized dashboard for each user, providing a quick overview of their activities, stats, and urgent requests.
- **Blood Requests:** A streamlined process for creating and managing blood requests.
- **Donor Search:** A powerful search functionality to find eligible blood donors based on various criteria.
- **Real-time Messaging:** A built-in messaging system for seamless communication between users.

### Detailed Feature List

#### 1. User Management

- **Registration:** A multi-step registration form to collect detailed user information, including:
  - Account details (email, password)
  - Personal information (name, date of birth, gender, blood type, etc.)
  - Location and emergency contact details
- **User Roles:** Support for different user types, such as:
  - General Public
  - Rotaractor
  - Rotary Club Member
  - Medical Professional
- **Login:** A secure login form with email and password authentication.
- **Password Management:**
  - Password visibility toggle
  - "Forgot Password" functionality
  - Password confirmation during registration

#### 2. Dashboard

- **Welcome Header:** A personalized greeting with the user's name, district, blood type, and total donations.
- **Statistics:** A grid of key statistics, including:
  - Lives Saved
  - Compatible Requests
  - District Rank
  - Response Time
- **Urgent Requests:** A dedicated section to display critical blood requests.
- **Recent Activity:** A feed of recent activities, such as donations, messages, and matches with requests.
- **Upcoming Appointments:** A list of upcoming blood donation appointments and health checkups.
- **Quick Actions:** Buttons for easy access to common actions like "Request Blood", "Find Donors", "View Map", and "Messages".
- **Achievement Progress:** A system to track the user's progress towards donation-related achievements.

#### 3. Blood Requests

- **Create Request:** A multi-step form to create a new blood request, with fields for:
  - Patient information (name, age, blood type, etc.)
  - Urgency level (critical, urgent, regular)
  - Hospital and contact information
  - Special requirements
- **Manage Requests:** A dedicated page to view and manage all blood requests created by the user.
- **Request Tracking:**
  - Tabbed navigation to filter requests by status (Active, Completed, All).
  - A progress bar to show the percentage of units fulfilled for each request.
  - A detailed view of each request in a modal window.
- **Request Actions:**
  - Edit active requests.
  - Mark fulfilled requests as "received".

#### 4. Donor Search

- **Search Filters:** A comprehensive set of filters to find suitable donors, including:
  - Blood type
  - Location
  - Maximum distance
  - Availability
- **Sortable Results:** The ability to sort search results by:
  - Distance
  - Rating
  - Total donations
  - Response time
- **Donor Profiles:** A summary of each donor's profile in the search results, with details like:
  - Name, blood type, location, and distance
  - Donation history and rating
- **Donation Eligibility:** A feature to check and display if a donor is currently eligible to donate blood.
- **Contact Options:** Buttons to contact a donor directly or send them a message.

#### 5. Messaging

- **Conversations List:** A list of all conversations with other users.
- **Search:** A search bar to find specific conversations.
- **Chat Interface:** A real-time chat interface to send and receive messages.
- **User Status:** A feature to indicate whether a user is online or offline.
- **Unread Messages:** A counter for unread messages in each conversation.
- **Quick Actions:** Buttons to perform actions like "Accept Donation" and "Schedule Meeting" directly from the chat.
