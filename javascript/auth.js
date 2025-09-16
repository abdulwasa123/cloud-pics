        // Global variables
        let isDarkMode = false
        let currentForm = "login"
        
        // Initialize the application
        document.addEventListener("DOMContentLoaded", () => {
          initializeTheme()
          initializeFormValidation()
          initializePasswordStrength()
        
          // Add form submit listeners
          document.getElementById("loginForm").addEventListener("submit", handleLogin)
          document.getElementById("signupForm").addEventListener("submit", handleSignup)
        })
        
        // Theme management
        function initializeTheme() {
          const savedTheme = localStorage.getItem("theme")
          if (savedTheme === "dark") {
            isDarkMode = true
            document.body.setAttribute("data-theme", "dark")
            document.getElementById("themeIcon").className = "fas fa-sun"
          }
        }
        
        function toggleTheme() {
          isDarkMode = !isDarkMode
          const body = document.body
          const themeIcon = document.getElementById("themeIcon")
        
          if (isDarkMode) {
            body.setAttribute("data-theme", "dark")
            themeIcon.className = "fas fa-sun"
            localStorage.setItem("theme", "dark")
          } else {
            body.removeAttribute("data-theme")
            themeIcon.className = "fas fa-moon"
            localStorage.setItem("theme", "light")
          }
        }
        
        // Form switching
        function switchForm(formType) {
          const loginForm = document.getElementById("loginForm")
          const signupForm = document.getElementById("signupForm")
          const toggleBtns = document.querySelectorAll(".toggle-btn")
        
          // Update active button
          toggleBtns.forEach((btn) => btn.classList.remove("active"))
          document.querySelector(`[data-form="${formType}"]`).classList.add("active")
        
          // Switch forms
          if (formType === "login") {
            loginForm.classList.remove("hidden")
            signupForm.classList.add("hidden")
          } else {
            loginForm.classList.add("hidden")
            signupForm.classList.remove("hidden")
          }
        
          currentForm = formType
        }
        
        // Password visibility toggle
        function togglePassword(inputId) {
          const input = document.getElementById(inputId)
          const button = input.parentElement.querySelector(".password-toggle i")
        
          if (input.type === "password") {
            input.type = "text"
            button.className = "fas fa-eye-slash"
          } else {
            input.type = "password"
            button.className = "fas fa-eye"
          }
        }
        
        // Password strength checker
        function initializePasswordStrength() {
          const passwordInput = document.getElementById("signupPassword")
          const strengthFill = document.getElementById("strengthFill")
          const strengthText = document.getElementById("strengthText")
        
          if (passwordInput) {
            passwordInput.addEventListener("input", (e) => {
              const password = e.target.value
              const strength = calculatePasswordStrength(password)
        
              // Update strength bar
              strengthFill.className = `strength-fill ${strength.level}`
              strengthText.textContent = strength.text
            })
          }
        }
        
        function calculatePasswordStrength(password) {
          let score = 0
          const feedback = []
        
          // Length check
          if (password.length >= 8) score += 1
          else feedback.push("at least 8 characters")
        
          // Uppercase check
          if (/[A-Z]/.test(password)) score += 1
          else feedback.push("uppercase letter")
        
          // Lowercase check
          if (/[a-z]/.test(password)) score += 1
          else feedback.push("lowercase letter")
        
          // Number check
          if (/\d/.test(password)) score += 1
          else feedback.push("number")
        
          // Special character check
          if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
          else feedback.push("special character")
        
          // Return strength level
          if (score === 0) return { level: "", text: "Password strength" }
          if (score <= 2) return { level: "weak", text: "Weak password" }
          if (score <= 3) return { level: "fair", text: "Fair password" }
          if (score <= 4) return { level: "good", text: "Good password" }
          return { level: "strong", text: "Strong password" }
        }
        
        // Form validation
        function initializeFormValidation() {
          // Real-time validation for all inputs
          const inputs = document.querySelectorAll("input")
          inputs.forEach((input) => {
            input.addEventListener("blur", validateInput)
            input.addEventListener("input", clearValidation)
          })
        }
        
        function validateInput(e) {
          const input = e.target
          const wrapper = input.parentElement
          const value = input.value.trim()
        
          // Clear previous validation
          clearValidation(e)
        
          // Email validation
          if (input.type === "email" && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(value)) {
              showInputError(wrapper, "Please enter a valid email address")
              return false
            }
          }
        
          // Password confirmation
          if (input.id === "confirmPassword" && value) {
            const password = document.getElementById("signupPassword").value
            if (value !== password) {
              showInputError(wrapper, "Passwords do not match")
              return false
            }
          }
        
          // Required field validation
          if (input.hasAttribute("required") && !value) {
            showInputError(wrapper, "This field is required")
            return false
          }
        
          // Show success state
          wrapper.classList.add("success")
          return true
        }
        
        function clearValidation(e) {
          const wrapper = e.target.parentElement
          wrapper.classList.remove("success", "error")
        
          // Remove error message
          const errorMsg = wrapper.parentElement.querySelector(".error-message")
          if (errorMsg) {
            errorMsg.remove()
          }
        }
        
        function showInputError(wrapper, message) {
          wrapper.classList.add("error")
        
          // Add error message
          const errorDiv = document.createElement("div")
          errorDiv.className = "error-message"
          errorDiv.textContent = message
          wrapper.parentElement.appendChild(errorDiv)
        }
        
        // Form submission handlers
        async function handleLogin(e) {
          e.preventDefault();
        
          const formData = new FormData(e.target);
          const email = formData.get("email");
          const password = formData.get("password");
          const rememberMe = document.getElementById("rememberMe").checked;
        
          if (!validateForm(e.target)) {
            return;
          }
        
          showLoading("Signing you in...");
        
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
        
          hideLoading();
        
          if (error) {
            showNotification("Login failed.", error.message);
          } else {
            if (!data.user.email_confirmed_at) {
              showNotification("Please verify your email before logging in.", "error");
              await supabase.auth.signOut();
              return;
            }
        
            showNotification("Logged in successfully!");
            if (rememberMe) {
              localStorage.setItem("userEmail", email);
            }
            window.location.href = "/"; // redirect to home
          }
        }        
        

      async function handleSignup(e) {
      e.preventDefault();
            
              const formData = new FormData(e.target);
              const firstName = formData.get("firstName");
              const lastName = formData.get("lastName");
              const email = formData.get("email");
              const password = formData.get("password");
              const confirmPassword = formData.get("confirmPassword");
              const agreeTerms = document.getElementById("agreeTerms").checked;
            
              // Validate form
              if (!validateForm(e.target)) {
                return;
              }
            
              // Check password match
              if (password !== confirmPassword) {
                showNotification("Passwords do not match", "error");
                return;
              }
            
              // Check terms agreement
              if (!agreeTerms) {
                showNotification("Please agree to the Terms of Service", "error");
                return;
              }
            
              // Show loading
              showLoading("Creating your account...");
            
              try {
                const { data, error } = await supabase.auth.signUp({
                  email,
                  password,
                  options: {
                    data: {
                      firstName,
                      lastName,
                    },
                    emailRedirectTo: window.location.origin + "/email-verified/", // where Supabase redirects after verification
                  },
                });
            
                hideLoading();
            
                if (error) {
                  showNotification("Signup failed. Please try again.", error.message);
                } else {
                  showNotification("Account created! Please check your email for a verification link.");
                  switchForm("login");
                  document.getElementById("loginEmail").value = email;
                }
              } catch (error) {
                hideLoading();
                showNotification("Unexpected error. Please try again.", error.message);
              }
            }

            function validateForm(form) {
              const inputs = form.querySelectorAll("input[required]")
              let isValid = true
            
              inputs.forEach((input) => {
                const event = { target: input }
                if (!validateInput(event)) {
                  isValid = false
                }
              })
            
              return isValid
            }
        
        // Google authentication
        async function signInWithGoogle() {
        
          showLoading("Connecting to Google...")
        
          try {
            const { data, error } = await supabase.auth.signInWithOAuth({
              provider: "google",
            });
        
            // Redirect to main app
            window.location.href = "/"
          } catch (error) {
            hideLoading()
            showNotification("Google sign-in failed. Please try again.", error.message)
          }
        };
        
        // Forgot password modal
        function showForgotPassword() {
          const modal = document.getElementById("forgotModal")
          modal.classList.add("show")
        }
        
        function closeForgotPassword() {
          const modal = document.getElementById("forgotModal")
          modal.classList.remove("show")
        }
        
        async function sendResetEmail() {
          const email = document.getElementById("resetEmail").value
        
          if (!email) {
            showNotification("Please enter your email address", "error")
            return
          }
        
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(email)) {
            showNotification("Please enter a valid email address", "error")
            return
          }
        
          try {
            // Call Supabase reset password
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: "https://cloud-pics.vercel.app/reset-password/",
            })            
        
            if (error) {
              showNotification(error.message, "error")
            } else {
              showNotification("Password reset link sent to your email", "success")
              closeForgotPassword()
            }
          } catch (err) {
            showNotification("Something went wrong. Please try again.", "error")
          }
        }
        
        // Utility functions
        function showLoading(message = "Loading...") {
          const overlay = document.getElementById("loadingOverlay")
          const text = overlay.querySelector("p")
          text.textContent = message
          overlay.classList.add("show")
        }
        
        function hideLoading() {
          const overlay = document.getElementById("loadingOverlay")
          overlay.classList.remove("show")
        }
        
        function showNotification(message, type = "info") {
          // Create notification element
          const notification = document.createElement("div")
          notification.className = `notification ${type}`
          notification.innerHTML = `
                <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `
        
          // Add styles
          notification.style.cssText = `
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: ${type === "success" ? "var(--success-color)" : type === "error" ? "var(--error-color)" : "var(--accent-primary)"};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                box-shadow: var(--shadow-lg);
                z-index: 3000;
                animation: slideIn 0.3s ease-out;
                max-width: 400px;
            `
        
          // Add to page
          document.body.appendChild(notification)
        
          // Auto remove after 5 seconds
          setTimeout(() => {
            if (notification.parentElement) {
              notification.remove()
            }
          }, 5000)
        }
        
        // Close modals when clicking outside
        document.addEventListener("click", (e) => {
          const forgotModal = document.getElementById("forgotModal")
          if (e.target === forgotModal) {
            closeForgotPassword()
          }
        })
        
        // Keyboard shortcuts
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            closeForgotPassword()
          }
        })
        
        // Add slide-in animation styles
        const style = document.createElement("style")
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .notification button {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                opacity: 0.8;
                transition: opacity 0.3s ease;
            }
            
            .notification button:hover {
                opacity: 1;
            }
        `
        document.head.appendChild(style)