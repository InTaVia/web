# Intavia Web Client

[InTaVia](https://intavia.eu/) web client.

See Deliverables 5.4 and 6.3 for a detailed description of the prototype and Deliverable 1.3 for a user manual.

## Installation Instructions

To run the prototype locally, an installation of Node.js (version 18.14.0 or greater) and npm (version 8.19.0 or greater) is required. Both can be downloaded and installed with the same installer from the Node.js website. Follow the download and installation instructions for your operating system on their website and in the installer. Alternatively, Node.js and npm can be installed using a Node version manager like nvm .

The first step of running the prototype is installing all necessary dependencies and npm packages, including the API-Client, Data Import component, and UI components. After cloning or downloading the prototype from the GitHub repository, navigate to the root directory with a terminal or command line tool. To install the dependencies, run the following command:

`npm install`

### Starting a Development Server

After the successful installation, the application is started on a development server locally on your machine with the following command:

`npm run dev`

While the development server is running, the application can be accessed locally at _localhost:3000_.

### Creating a Production Build

To create a production build of the application that can be deployed, run the following command after specifying the base URLs:

`npm run build`

The optimized build is saved in the .next folder and can be hosted with Node.js by running the following command:

`npm run start`

### Configuring the Backend API URL

By default, the application will access the InTaVia backend API hosted by the project consortium. The base URL of the backend is specified as an environment variable and can be configured to other backend instances, e.g., if you are running your own instance.
The API base URL is configured with the environment variable `NEXT_PUBLIC_INTAVIA_API_BASE_URL`. When running the application on a development server, the variable can be set in the _.env.development_ file located in the root directory.

For production builds, additionally, the environment variable `NEXT_PUBLIC_BASE_URL` should be set to the base URL of the hosted frontend. The environment variables for production builds can be set in the _.env.production.local_ file.
