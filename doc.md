# Passkey Lab Documentation

This document provides a detailed explanation of the Passkey Lab application, its components, and their interactions.

## 1. Overview

The Passkey Lab application demonstrates the integration of passkey authentication and other modern web features. It allows users to register and log in using passkeys or traditional passwords, and showcases a banking demo with step-up authentication for high-value transactions.

## 2. Components

### 2.1. `PasskeyLab.tsx`

This is the main component of the application, responsible for managing the application's state, views, and user interactions. It orchestrates the different authentication flows and displays various sections of the application based on the `currentView` state.

**Key Features:**
    - **View Management:** Handles transitions between different views: `home`, `register`, `login`, `dashboard`, and `banking`.
    - **Authentication Flows:** Supports both passkey and password-based registration and login.
    - **Conversion Tracking:** Implements a system to track the duration and success of authentication flows.
    - **Transaction Handling:** Simulates financial transactions, including step-up authentication for high-value transactions.
    - **State Management:** Uses React's `useState` hook for managing component state.
    - **UI Components:** Leverages various UI components from `@/components/ui/` for a consistent user interface.

**Internal Logic:**
    - **State Variables:**
      -   `currentView`: Controls which view is currently displayed.
      -   `users`: Stores user data (username, public key, creation date).
      -   `currentUser`: Stores the currently logged-in user.
      -   `username`, `password`: Input states for authentication forms.
      -   `authFlow`: Tracks the selected authentication method ('passkey' or 'password') during registration/login.
      -   `conversionMetrics`: An array to store metrics for different conversion flows.
      -   `currentMetric`: Stores the metric for the currently active conversion flow.
      -   `transactionAmount`: Stores the amount for banking transactions.
      -   `isLoading`: Boolean to indicate loading states.
    - **Helper Functions:**
      -   `isWebAuthnSupported`: Checks browser support for WebAuthn.
      -   `startConversionTracking`: Initializes a new conversion metric.
      -   `completeConversionTracking`: Finalizes and records a conversion metric.
      -   `handlePasskeyRegistration`: Simulates passkey registration.
      -   `handlePasswordRegistration`: Simulates password registration.
      -   `handlePasskeyLogin`: Simulates passkey login.
      -   `handleTransaction`: Simulates transaction processing with step-up authentication.
      -   `averageConversionTime`: Calculates the average duration for a given flow.
    - **Render Functions:**
      -   `renderHome()`: Displays the landing page with a call to action.
      -   `renderRegister()`: Renders the registration form with tabs for passkey and password.
      -   `renderLogin()`: Renders the login form, primarily for passkey authentication.
      -   `renderDashboard()`: Displays user-specific information and metrics after login.
      -   `renderBanking()`: Shows the banking demo interface for transactions.

### 2.2. UI Components (`src/components/ui/`)

The application utilizes a set of pre-built UI components for consistent styling and functionality. These components are imported from `@/components/ui/` and are typically used for building the user interface elements within the `PasskeyLab` component.

- **`Card`**: Used for structuring content sections like forms, dashboards, and banking interfaces. It provides a container with a border and shadow.
- **`Button`**: For interactive elements like "Get Started", "Register", "Sign In", and "Confirm Transfer". Supports various variants and states (e.g., disabled, loading).
- **`Input`**: For user input fields (username, password, transaction amount). Handles text, password, and number types.
- **`Label`**: For associating labels with input fields, improving accessibility and usability.
- **`Badge`**: To display status information (e.g., "WebAuthn Ready", "Active", "Enabled") with distinct visual styles.
- **`Tabs`**: Used in the registration view to switch between passkey and password authentication methods, organizing content into selectable tabs.
- **`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`**: Sub-components of `Card` for organizing content within cards into distinct sections (header, title, description, and main content).
- **`Dialog`, `AlertDialog`**: Components for modal interactions, used for alerts or confirmations. While available, they are not directly used for the primary flows in `PasskeyLab.tsx`.
- **`Sheet`**: A component for slide-over panels, often used for mobile navigation or sidebars.
- **`Tooltip`**: Provides additional information or context when a user hovers over an element.
- **`Skeleton`**: Used to display loading placeholders, improving the perceived performance of the application.
- **`Toast`, `Toaster`**: Components for displaying temporary, non-intrusive user notifications and feedback messages.

## 3. Component Flow and User Interaction

The application follows a state-driven flow managed by the `PasskeyLab` component:

1. **Initial Load (`home` view):**
    - The application starts in the `home` view.
    - User sees a welcome message and a "Get Started" button.
    - Clicking "Get Started" transitions to the `register` view and starts passkey conversion tracking.

2. **Registration (`register` view):**
    - User chooses between "Passkey" and "Password" using `Tabs`.
    - **Passkey Registration:**
        - User enters a username.
        - Clicking "Register with Passkey" triggers `handlePasskeyRegistration`.
        - Simulates WebAuthn API interaction.
        - Upon success, a new user is created, `currentUser` is set, conversion tracking is completed, a success toast is shown, and the view transitions to `dashboard`.
    - **Password Registration:**
        - User enters username and password.
        - Clicking "Register with Password" triggers `handlePasswordRegistration`.
        - Simulates a longer network delay.
        - Upon success, a new user is created, `currentUser` is set, conversion tracking is completed, a success toast is shown, and the view transitions to `dashboard`.
    - Clicking "Already have an account? Sign in" transitions to the `login` view and starts conversion tracking for the selected `authFlow`.

3. **Login (`login` view):**
    - User enters a username.
    - Clicking "Sign in with Passkey" triggers `handlePasskeyLogin`.
    - Simulates passkey authentication against existing users.
    - Upon success, `currentUser` is set, conversion tracking is completed, a success toast is shown, and the view transitions to `dashboard`.
    - Clicking "Don't have an account? Sign up" transitions back to the `register` view.

4. **Dashboard (`dashboard` view):**
    - Displays a welcome message with the current user's name.
    - Shows security status, conversion metrics (average times for passkey vs. password), and recent activity.
    - Provides a "Banking Demo" button to navigate to the `banking` view.
    - Includes a "Sign Out" button to return to the `home` view.

5. **Banking Demo (`banking` view):**
    - Allows the user to enter a transaction amount.
    - If the amount is over €150, it simulates a "step-up authentication" process.
    - If the amount is €150 or less, the transaction is completed directly.
    - The "Confirm Transfer" button triggers `handleTransaction`.
    - Success or failure messages are displayed via toasts.
    - Clicking "Back to Dashboard" returns to the `dashboard` view.

## 4. Conversion Tracking Logic

The `startConversionTracking` and `completeConversionTracking` functions manage the lifecycle of conversion metrics.

- `startConversionTracking` initializes a new `ConversionMetric` object with the `flow` type and `startTime`. It sets this as the `currentMetric`.
- `completeConversionTracking` updates the `currentMetric` with `endTime`, calculates the `duration`, marks `completed` as true, and adds it to the `conversionMetrics` state. It then clears `currentMetric` and displays a toast notification summarizing the completed flow and its duration.
- The `averageConversionTime` function filters `conversionMetrics` for a specific `flow` that are marked as `completed`, sums their `duration`, and divides by the count to return the average.

## 5. Transaction Logic

The `handleTransaction` function processes banking transactions:

- It parses the `transactionAmount` input into a floating-point number.
- It checks if the `amount` exceeds €150.
  - If it does, it simulates a "step-up authentication" process by setting `isLoading` to true, introducing delays using `setTimeout`, and displaying toast messages for required authentication and eventual approval.
    - If the amount is €150 or less, it directly confirms the transaction with a success toast.
- In both cases, the `transactionAmount` state is cleared after the transaction is processed.
- The `isLoading` state is managed throughout these operations to provide visual feedback.
