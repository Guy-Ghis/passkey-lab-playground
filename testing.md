# Passkey Lab Testing Guide

This guide provides step-by-step instructions for testing the Passkey Lab application, including expected outcomes and how to monitor background exchanges.

## 1. Setup

1.  **Prerequisites:** Ensure you have a modern browser that supports WebAuthn (e.g., Chrome, Firefox, Edge, Safari).
2.  **Run the Application:** Start the development server if it's not already running. Typically, this would be `npm run dev` or `yarn dev` in the project's root directory.
3.  **Access the Application:** Open your browser and navigate to the application's URL (usually `http://localhost:5173` or similar).

## 2. Testing Authentication Flows

### 2.1. Home View

*   **Steps:**
    1.  Navigate to the application's root URL.
    2.  Observe the initial "Passkey Lab" landing page.
    3.  Click the "Get Started" button.
*   **Expected Outcome:**
    *   The application should display the "Passkey Lab" title, a description, and a "Get Started" button.
    *   Clicking "Get Started" should navigate the user to the registration view.
    *   A "Passkey Lab" conversion metric should be initiated.
*   **Verifying Outcomes & Background Exchanges:**
    *   **UI Check:** Confirm the correct elements are visible and the view transitions as expected.
    *   **State Check (React DevTools):** Inspect the `currentView` state variable in `PasskeyLab` component to ensure it changes from 'home' to 'register'. Check if `currentMetric` is set with `flow: 'passkey'` and `completed: false`.

### 2.2. Registration - Passkey Flow

*   **Steps:**
    1.  From the "Get Started" button, you should be on the registration view.
    2.  Ensure the "Passkey" tab is selected.
    3.  Enter a unique username in the "Username" field (e.g., `testuser_pk`).
    4.  Click the "Register with Passkey" button.
    5.  Follow your browser's prompts for passkey creation (e.g., using a security key, facial recognition, or fingerprint).
*   **Expected Outcome:**
    *   The "Register with Passkey" button should show a loading indicator (spinning clock icon).
    *   Upon successful passkey creation, a "Registration Successful" toast notification should appear.
    *   The application should navigate to the "Dashboard" view.
    *   The user's details should be stored internally.
    *   A "Passkey" conversion metric should be completed and recorded.
*   **Verifying Outcomes & Background Exchanges:**
    *   **UI Check:** Confirm the loading indicator, toast notification, and view transition to "Dashboard".
    *   **State Check (React DevTools):**
        *   Verify `isLoading` is `false` after completion.
        *   Confirm `currentView` is 'dashboard'.
        *   Check if a new user object is added to the `users` state with the correct username.
        *   Inspect `conversionMetrics` to find a completed metric for `flow: 'passkey'` with a `duration`.
    *   **Browser Console:** Look for any console logs related to WebAuthn or simulated operations.

### 2.3. Registration - Password Flow

*   **Steps:**
    1.  On the registration view, select the "Password" tab.
    2.  Enter a unique username in the "Username" field (e.g., `testuser_pw`).
    3.  Enter a password in the "Password" field (e.g., `password123`).
    4.  Click the "Register with Password" button.
*   **Expected Outcome:**
    *   The "Register with Password" button should show a loading indicator.
    *   Upon successful registration, a "Registration Successful" toast notification should appear.
    *   The application should navigate to the "Dashboard" view.
    *   The user's details should be stored internally.
    *   A "Password" conversion metric should be completed and recorded.
*   **Verifying Outcomes & Background Exchanges:**
    *   **UI Check:** Confirm the loading indicator, toast notification, and view transition to "Dashboard".
    *   **State Check (React DevTools):**
        *   Verify `isLoading` is `false`.
        *   Confirm `currentView` is 'dashboard'.
        *   Check if a new user object is added to the `users` state.
        *   Inspect `conversionMetrics` to find a completed metric for `flow: 'password'` with a `duration`.

### 2.4. Login - Passkey Flow

*   **Steps:**
    1.  From the "Get Started" button, click "Already have an account? Sign in". This should take you to the login view.
    2.  Enter the username of an existing registered user (e.g., `testuser_pk`).
    3.  Click the "Sign in with Passkey" button.
    4.  Follow your browser's prompts for passkey authentication.
*   **Expected Outcome:**
    *   The "Sign in with Passkey" button should show a loading indicator.
    *   Upon successful authentication, a "Login Successful" toast notification should appear.
    *   The application should navigate to the "Dashboard" view.
    *   The `currentUser` state should be updated with the logged-in user.
    *   A "Passkey" conversion metric should be completed and recorded.
*   **Verifying Outcomes & Background Exchanges:**
    *   **UI Check:** Confirm loading indicator, toast notification, and transition to "Dashboard".
    *   **State Check (React DevTools):**
        *   Verify `isLoading` is `false`.
        *   Confirm `currentView` is 'dashboard'.
        *   Check if `currentUser` state is updated with the correct user object.
        *   Inspect `conversionMetrics` for a completed 'passkey' metric.

### 2.5. Login - Navigation to Registration

*   **Steps:**
    1.  On the login view, click "Don't have an account? Sign up".
*   **Expected Outcome:**
    *   The application should navigate back to the "Register" view.
    *   Conversion tracking for the previously selected `authFlow` should be initiated.
*   **Verifying Outcomes & Background Exchanges:**
    *   **UI Check:** Confirm the view transitions to "Register".
    *   **State Check (React DevTools):** Verify `currentView` is 'register' and `currentMetric` is set for the appropriate `authFlow`.

## 3. Testing Dashboard View

*   **Steps:**
    1.  Log in successfully using either passkey or password.
    2.  Observe the "Dashboard" view.
    3.  Verify the display of the welcome message with the correct username.
    4.  Check the "Security Status" section for "Passkey Enabled" and "Two-Factor Auth Enabled" badges.
    5.  Check the "Conversion Metrics" section for average times for passkey and password flows.
    6.  Click the "Banking Demo" button.
    7.  Click the "Sign Out" button.
*   **Expected Outcome:**
    *   All displayed information (username, security status, metrics) should be accurate based on the user's state and previous actions.
    *   Clicking "Banking Demo" should navigate to the `banking` view.
    *   Clicking "Sign Out" should navigate back to the `home` view.
*   **Verifying Outcomes & Background Exchanges:**
    *   **UI Check:** Confirm all displayed text and badges are correct.
    *   **State Check (React DevTools):**
        *   Verify `currentView` changes correctly when navigating to "Banking Demo" or "Sign Out".
        *   Ensure the displayed average conversion times are calculated correctly based on previous test runs.

## 4. Testing Banking Demo

### 4.1. Standard Transaction (<= €150)

*   **Steps:**
    1.  Navigate to the "Banking Demo" view from the dashboard.
    2.  Enter a transaction amount less than or equal to €150 (e.g., `100`).
    3.  Click the "Confirm Transfer" button.
*   **Expected Outcome:**
    *   A "Transaction Approved" toast notification should appear with the transaction amount.
    *   The transaction amount input field should be cleared.
    *   No step-up authentication prompts should appear.
*   **Verifying Outcomes & Background Exchanges:**
    *   **UI Check:** Confirm the toast notification appears and the input field is cleared.
    *   **State Check (React DevTools):** Verify `transactionAmount` is cleared.

### 4.2. High-Value Transaction (> €150) with Step-up Authentication

*   **Steps:**
    1.  Navigate to the "Banking Demo" view.
    2.  Enter a transaction amount greater than €150 (e.g., `200`).
    3.  Click the "Confirm Transfer" button.
    4.  Follow your browser's prompts for step-up passkey authentication.
*   **Expected Outcome:**
    *   The "Confirm Transfer" button should show a loading indicator.
    *   A toast notification indicating "Step-up Authentication Required" should appear.
    *   After a delay, a "Transaction Approved" toast notification with step-up authentication confirmation should appear.
    *   The transaction amount input field should be cleared.
*   **Verifying Outcomes & Background Exchanges:**
    *   **UI Check:** Confirm loading indicator, sequential toast notifications, and cleared input field.
    *   **State Check (React DevTools):** Verify `isLoading` state changes appropriately and `transactionAmount` is cleared.

### 4.3. Navigation Back to Dashboard

*   **Steps:**
    1.  From the "Banking Demo" view, click the "Back to Dashboard" button.
*   **Expected Outcome:**
    *   The application should navigate back to the "Dashboard" view.
*   **Verifying Outcomes & Background Exchanges:**
    *   **UI Check:** Confirm the view transitions back to the "Dashboard".
    *   **State Check (React DevTools):** Verify `currentView` is 'dashboard'.