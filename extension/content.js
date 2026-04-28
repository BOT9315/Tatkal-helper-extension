{
    "manifest_version": 3,
    "name": "Tatkal Helper",
    "version": "1.0",
    "description": "IRCTC Tatkal Booking Helper — auto-fills passenger details to save precious seconds.",
    "permissions": [
        "storage",
        "activeTab",
        "scripting"
    ],
    "host_permissions": [
        "https://www.irctc.co.in/*"
    ],
    "action": {
        "default_popup": "popup.html",
        "default_title": "Tatkal Helper",
        "default_icon": {
            "16": "icons/icon16.png",
            "48": "icons/icon48.png",
            "128": "icons/icon128.png"
        }
    },
    "icons": {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
    },
    "content_scripts": [
        {
            "matches": [
                "https://www.irctc.co.in/*"
            ],
            "js": [
                "content.js"
            ],
            "run_at": "document_idle"
        }
    ]
}
