/**
 * RF Prestige — Authentication & Authorization
 * Role separation (Customer vs Admin), Session Management, Route Guards
 */

(function () {
  'use strict';

  var USER_KEY = 'rf_prestige_user';

  function getCurrentUser() {
    var raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function setCurrentUser(user) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    // Dispatch custom event for navbar/UI reactivity
    window.dispatchEvent(new CustomEvent('rf:auth-change', { detail: user }));
  }

  function login(email, password) {
    return new Promise(function (resolve, reject) {
      email = String(email || '').trim().toLowerCase();
      password = String(password || '');

      // Demo users list
      var users = (window.MockData && window.MockData.Users) ? window.MockData.Users : [
        {
          Id: "usr-cust-001",
          Email: "customer@rfprestige.ro",
          PasswordHash: "Demo123!",
          FirstName: "John",
          LastName: "Doe",
          Role: "Customer"
        },
        {
          Id: "usr-admin-001",
          Email: "admin@rfprestige.ro",
          PasswordHash: "Admin123!",
          FirstName: "Roberto",
          LastName: "Admin",
          Role: "Admin"
        }
      ];

      var matched = users.find(function (u) {
        return u.Email.toLowerCase() === email;
      });

      if (!matched || matched.PasswordHash !== password) {
        reject(new Error("Invalid email or password. Please verify your credentials."));
        return;
      }

      var sessionUser = {
        Id: matched.Id,
        Email: matched.Email,
        FirstName: matched.FirstName,
        LastName: matched.LastName,
        Role: matched.Role
      };

      setCurrentUser(sessionUser);
      resolve(sessionUser);
    });
  }

  function register(data) {
    return new Promise(function (resolve, reject) {
      var email = String(data.Email || '').trim().toLowerCase();
      var password = String(data.Password || '');
      var firstName = String(data.FirstName || '').trim();
      var lastName = String(data.LastName || '').trim();

      if (!email || !password || !firstName || !lastName) {
        reject(new Error("All registration fields are required."));
        return;
      }

      if (password.length < 6) {
        reject(new Error("Password must be at least 6 characters long."));
        return;
      }

      var newUser = {
        Id: 'usr-' + Math.random().toString(36).substring(2, 9),
        Email: email,
        PasswordHash: password,
        FirstName: firstName,
        LastName: lastName,
        Role: "Customer"
      };

      if (window.MockData && window.MockData.Users) {
        window.MockData.Users.push(newUser);
      }

      var sessionUser = {
        Id: newUser.Id,
        Email: newUser.Email,
        FirstName: newUser.FirstName,
        LastName: newUser.LastName,
        Role: newUser.Role
      };

      setCurrentUser(sessionUser);
      resolve(sessionUser);
    });
  }

  function logout() {
    return new Promise(function (resolve) {
      setCurrentUser(null);
      resolve(true);
    });
  }

  function isAuthenticated() {
    return getCurrentUser() !== null;
  }

  function isAdmin() {
    var u = getCurrentUser();
    return u !== null && u.Role === 'Admin';
  }

  function requireAuth(redirectPath) {
    if (!isAuthenticated()) {
      var currentUrl = encodeURIComponent(window.location.href);
      var target = (redirectPath || '../account/login.html') + '?returnUrl=' + currentUrl;
      window.location.href = target;
      return false;
    }
    return true;
  }

  function requireAdmin(redirectPath) {
    if (!isAdmin()) {
      var currentUrl = encodeURIComponent(window.location.href);
      var target = (redirectPath || '../account/login.html') + '?returnUrl=' + currentUrl;
      window.location.href = target;
      return false;
    }
    return true;
  }

  window.Auth = {
    getCurrentUser: getCurrentUser,
    setCurrentUser: setCurrentUser,
    login: login,
    register: register,
    logout: logout,
    isAuthenticated: isAuthenticated,
    isAdmin: isAdmin,
    requireAuth: requireAuth,
    requireAdmin: requireAdmin
  };

})();

