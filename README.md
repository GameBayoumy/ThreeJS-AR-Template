# WebXR Template

This repository provides a WebXR template for uploading and manipulating 3D models in a browser or phone browser using the WebXR viewer. It is designed for a workshop and allows participants to replace the default 3D model with their own uploaded model and adjust the scale of the model in the web application.

## Instructions

Follow the steps below to set up and use this WebXR template:

1. Clone or download the repository to your local machine.
2. Install the required dependencies by running the following command:

    ```bash
    npm install
    ```

3. Open the `Scene.jsx` file located in the `src` directory.

4. Locate the following lines of code in the `Scene.jsx` file:

    ```jsx
    // ========== CHANGE THESE LINES ==========

    // Replace the path with the path to your own uploaded FBX file
    const model = useFBX("/building/build_001.fbx")

    // Replace this number to scale your model
    const scale = 0.01

    // ======================================
    ```

5. Replace the `'/building/build_001.fbx'` path with the path to your own uploaded FBX file. Make sure the FBX file is accessible and located within your project directory.

6. Adjust the `scale` variable to scale your model appropriately.

7. Save the changes to the `Scene.jsx` file.

8. Open the `index.jsx` file located in the `src` directory.

9. Run the project locally by executing the following command:

    ```bash
    npm run dev
    ```

10. After the development server starts, open your browser and navigate to the provided local URL (usually http://localhost:5173).

11. If your browser supports WebXR, you will see an "AR" button. Click the button to enter the augmented reality mode. If your browser does not support WebXR, you can use the WebXR viewer app on your phone to view the AR experience.

12. Once in AR mode, you can use your device's camera to scan the environment and place the 3D model. The model will be displayed at the hit point where you aim your device at.

That's it! You have successfully set up the WebXR template and replaced the default 3D model with your own uploaded model. Feel free to experiment with different models and scales to create your own augmented reality experiences.

## Notes

-   Make sure to replace the `'/building/build_001.fbx'` path with the correct path to your own FBX file. Ensure that the FBX file is in a format compatible with the WebXR viewer.

-   Adjust the `scale` variable according to your model's size to ensure it appears at an appropriate scale in the augmented reality scene.

-   If you encounter any issues or have any questions, please refer to the official documentation of the used libraries (React, Three.js, etc.) or consult the workshop facilitator for assistance.

-   Have fun exploring the possibilities of WebXR and creating your own AR experiences!
