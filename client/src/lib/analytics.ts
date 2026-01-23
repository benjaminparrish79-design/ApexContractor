import ReactGA from "react-ga4";

// Google Analytics Measurement ID from Firebase configuration
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

/**
 * Initialize Google Analytics
 */
export function initializeAnalytics(): void {
  if (!MEASUREMENT_ID) {
    console.warn("[Analytics] Measurement ID not configured");
    return;
  }

  try {
    ReactGA.initialize(MEASUREMENT_ID);
    console.log("[Analytics] Initialized with ID:", MEASUREMENT_ID);
  } catch (error) {
    console.error("[Analytics] Failed to initialize:", error);
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string, title: string): void {
  if (!MEASUREMENT_ID) return;

  try {
    ReactGA.send({
      hitType: "pageview",
      page: path,
      title: title,
    });
  } catch (error) {
    console.error("[Analytics] Error tracking page view:", error);
  }
}

/**
 * Track custom event
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
): void {
  if (!MEASUREMENT_ID) return;

  try {
    ReactGA.event(eventName, eventParams);
  } catch (error) {
    console.error("[Analytics] Error tracking event:", error);
  }
}

/**
 * Track user interaction
 */
export function trackUserInteraction(action: string, label: string, value?: number): void {
  trackEvent("user_interaction", {
    action,
    label,
    value: value || 0,
  });
}

/**
 * Track invoice creation
 */
export function trackInvoiceCreated(invoiceNumber: string, amount: number): void {
  trackEvent("invoice_created", {
    invoice_number: invoiceNumber,
    amount,
  });
}

/**
 * Track payment
 */
export function trackPayment(invoiceNumber: string, amount: number, method: string): void {
  trackEvent("payment_completed", {
    invoice_number: invoiceNumber,
    amount,
    payment_method: method,
  });
}

/**
 * Track client creation
 */
export function trackClientCreated(clientName: string): void {
  trackEvent("client_created", {
    client_name: clientName,
  });
}

/**
 * Track project creation
 */
export function trackProjectCreated(projectName: string, budget: number): void {
  trackEvent("project_created", {
    project_name: projectName,
    budget,
  });
}

/**
 * Track email sent
 */
export function trackEmailSent(emailType: string, recipientEmail: string): void {
  trackEvent("email_sent", {
    email_type: emailType,
    recipient: recipientEmail,
  });
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(featureName: string, metadata?: Record<string, string | number>): void {
  trackEvent("feature_used", {
    feature_name: featureName,
    ...metadata,
  });
}

/**
 * Set user ID for analytics
 */
export function setUserId(userId: string | number): void {
  if (!MEASUREMENT_ID) return;

  try {
    ReactGA.set({ user_id: userId.toString() });
  } catch (error) {
    console.error("[Analytics] Error setting user ID:", error);
  }
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, string | number | boolean>): void {
  if (!MEASUREMENT_ID) return;

  try {
    ReactGA.set(properties);
  } catch (error) {
    console.error("[Analytics] Error setting user properties:", error);
  }
}

/**
 * Track error
 */
export function trackError(errorMessage: string, errorCode?: string): void {
  trackEvent("error_occurred", {
    error_message: errorMessage,
    error_code: errorCode || "unknown",
  });
}
