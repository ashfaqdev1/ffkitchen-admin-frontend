import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ThemeToggle from "../ToggleTheme";
export default function Header({ onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  // Create a reference point to monitor clicks outside the profile box
  const dropdownRef = useRef(null);

  // Turned into state with your original fallback variables intact
  const [admin, setAdmin] = useState({
    name: "Farhan Farooq",
    role: "Admin",
    email: "admin@ffkitchen.pk",
  });

  // Dynamically load stored admin details when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const adminData = JSON.parse(storedUser);
        // return console.log(adminData.user.name);
        setAdmin(adminData.user);
      } catch (err) {
        console.error("Failed to parse user data from localStorage", err);
      }
    }
  }, []);

  // Automatically close dropdown if clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate matching subheadings dynamically based on the active React Router path
  const getPageMeta = () => {
    switch (location.pathname) {
      case "/products":
        return {
          title: "Products",
          sub: "Manage your premium catalogue items",
        };
      case "/orders":
        return {
          title: "Order",
          sub: "Monitor and update delivery fulfillment status",
        };
      default:
        return {
          title: "Dashboard",
          sub: `Welcome back, ${admin.name}`, // Changed dynamically to use state
        };
    }
  };

  const { title, sub } = getPageMeta();

  // Toggles the dropdown menu safely
  const toggleProfileDropdown = (e) => {
    e.stopPropagation(); // Prevents layout bubbling conflicts
    setProfileOpen(!profileOpen);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
      <div className="topbar-right">
        <ThemeToggle />

        {/* Added ref and toggler handler here */}
        <div
          className="profile-wrap"
          ref={dropdownRef}
          onClick={toggleProfileDropdown}
        >
          <div className="profile-btn">
            {/* Generates avatar initials dynamically if backend doesn't provide them */}
            <div className="avatar">
              {admin.avatar || admin.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="profile-info">
              <div className="pname">{admin.name}</div>
              <div className="prole">{admin.role}</div>
            </div>
            <span
              style={{ color: "var(--muted)", fontSize: 10, marginLeft: 4 }}
            >
              ▾
            </span>
          </div>

          {profileOpen && (
            // e.stopPropagation() ensures that clicking options inside the dropdown won't break the toggle
            <div
              className="profile-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="profile-dropdown-header">
                <div className="pd-name">{admin.name}</div>
                <div className="pd-email">{admin.email}</div>
              </div>
              <div className="pd-item" onClick={() => setProfileOpen(false)}>
                👤 My Profile
              </div>
              <div className="pd-item" onClick={() => setProfileOpen(false)}>
                ⚙️ Settings
              </div>
              <div
                className="pd-item danger"
                onClick={() => {
                  setProfileOpen(false);
                  onLogout(); // Triggers the safe logout modal sequence perfectly
                }}
              >
                ⇠ Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
