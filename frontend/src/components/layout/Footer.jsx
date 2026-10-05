import React from "react";

export default function Footer() {
    return (
        <footer className="bg-light text-center py-3 border-top mt-auto">
            <small className="text-muted">&copy; {new Date().getFullYear()} ERP Fashion &middot; All Rights Reserved</small>
        </footer>
    );
}
