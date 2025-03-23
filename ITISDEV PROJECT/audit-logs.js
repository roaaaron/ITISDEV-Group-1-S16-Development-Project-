const AUDIT_LOG_KEY = "auditLogs";

/**
 * Adds an audit log entry and sends it to the backend.
 * @param {string} action - The type of action performed.
 * @param {string} details - Additional details about the action.
 */
async function logAuditTrail(action, details) {
    const userId = await getCurrentUserId();
    const newLog = {
        timestamp: new Date().toISOString(),
        userId,
        action,
        details
    };

    // Store logs in localStorage for quick access
    const logs = JSON.parse(localStorage.getItem(AUDIT_LOG_KEY)) || [];
    logs.push(newLog);
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));

    // Send log to backend
    try {
        await fetch("/api/logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newLog)
        });
    } catch (err) {
        console.error("Failed to send audit log to server:", err);
    }
}

/**
 * Retrieves the current user's ID from session storage or API.
 * @returns {Promise<string>}
 */
async function getCurrentUserId() {
    // Check if user ID is stored in sessionStorage
    let userId = sessionStorage.getItem("currentUserId");
    if (userId) return userId;

    // Fetch from backend if not found in sessionStorage
    try {
        const res = await fetch("/api/auth/user");
        if (res.ok) {
            const data = await res.json();
            userId = data.userId;
            sessionStorage.setItem("currentUserId", userId);
            return userId;
        }
    } catch (err) {
        console.error("Failed to fetch user ID:", err);
    }

    return "UnknownUser"; // Fallback if authentication fails
}

/**
 * Fetches the audit logs from localStorage.
 */
function getAuditLogs() {
    return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY)) || [];
}

/**
 * Clears the audit logs (for admin use).
 */
function clearAuditLogs() {
    localStorage.removeItem(AUDIT_LOG_KEY);
}

// Hook into key events
document.addEventListener("DOMContentLoaded", () => {
    // Log user login
    document.getElementById("login-form")?.addEventListener("submit", async () => {
        logAuditTrail("User Login", "User logged in successfully.");
    });

    // Log file uploads
    document.getElementById("uploadForm")?.addEventListener("submit", async () => {
        const fileName = document.getElementById("documentFile").files[0]?.name;
        logAuditTrail("File Upload", `Uploaded document: ${fileName}`);
    });

    // Log document searches
    document.getElementById("searchForm")?.addEventListener("submit", async () => {
        const query = document.getElementById("searchQuery").value;
        logAuditTrail("Document Search", `Search query: ${query}`);
    });

    // Log report generation
    document.getElementById("generateReport")?.addEventListener("click", async () => {
        logAuditTrail("Report Generation", "User generated a report.");
    });

    // Log project milestones access
    document.getElementById("milestone-tracking")?.addEventListener("click", async () => {
        logAuditTrail("Milestone Access", "User accessed the milestone tracking page.");
    });

    // Log logout
    document.getElementById("logout")?.addEventListener("click", async () => {
        logAuditTrail("User Logout", "User logged out.");
        sessionStorage.removeItem("currentUserId"); // Clear session storage on logout
    });
});
