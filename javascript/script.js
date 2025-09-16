        // Global variables
        let selectedFiles = []
        let uploadedImages = []
        let isDarkMode = false
        
        // DOM elements
        const uploadArea = document.getElementById("uploadArea")
        const fileInput = document.getElementById("fileInput")
        const uploadOverlay = document.getElementById("uploadOverlay")
        const previewSection = document.getElementById("previewSection")
        const previewGrid = document.getElementById("previewGrid")
        const galleryGrid = document.getElementById("galleryGrid")
        const imageCount = document.getElementById("imageCount")
        const profileDropdown = document.getElementById("profileDropdown")
        
        // Initialize the application
        document.addEventListener("DOMContentLoaded", () => {
          initializeEventListeners()
          initializeDarkMode()
          updateImageCount()
          handleResponsiveView() // Check initial view
        })
        
        // Initialize all event listeners
        function initializeEventListeners() {
          // Upload area events
          uploadArea.addEventListener("click", () => fileInput.click())
          uploadArea.addEventListener("dragover", handleDragOver)
          uploadArea.addEventListener("dragleave", handleDragLeave)
          uploadArea.addEventListener("drop", handleDrop)
        
          // File input change
          fileInput.addEventListener("change", handleFileSelect)
        
          // Search functionality
          const searchInput = document.querySelector(".search-input")
          searchInput.addEventListener("input", handleSearch)
        
          // Sort functionality
          const sortSelect = document.querySelector(".sort-select")
          sortSelect.addEventListener("change", handleSort)
        
          // Window resize for responsive view
          window.addEventListener("resize", handleResponsiveView)
        
          // Close dropdown when clicking outside
          document.addEventListener("click", (event) => {
            const helpModal = document.getElementById("helpModal")
            if (event.target === helpModal) {
              helpModal.classList.remove("show")
            }
        
            // Existing dropdown close logic
            if (!event.target.closest(".profile-dropdown")) {
              profileDropdown.classList.remove("show")
            }
        
            if (!event.target.closest(".nav-menu") && !event.target.closest(".mobile-menu-toggle")) {
              document.getElementById("navMenu").classList.remove("show")
            }
          })
        }
        
        // Dark mode toggle
        function toggleDarkMode() {
          isDarkMode = !isDarkMode
          const body = document.body
          const darkModeIcon = document.getElementById("darkModeIcon")
        
          if (isDarkMode) {
            body.setAttribute("data-theme", "dark")
            darkModeIcon.className = "fas fa-sun"
            localStorage.setItem("darkMode", "true")
          } else {
            body.removeAttribute("data-theme")
            darkModeIcon.className = "fas fa-moon"
            localStorage.setItem("darkMode", "false")
          }
        }
        
        // Mobile menu toggle
        function toggleMobileMenu() {
          const navMenu = document.getElementById("navMenu")
          navMenu.classList.toggle("show")
        }
        
        // Confirm delete account
        function confirmDeleteAccount() {
          if (
            confirm(
              "Are you sure you want to delete your account? This action cannot be undone and all your images will be permanently deleted.",
            )
          ) {
            // Implement account deletion logic here
            alert("Account deletion functionality would be implemented here.")
            console.log("Deleting account...")
            // You can add API call to delete account
            // deleteAccountFromServer();
          }
        }
        
        // Initialize dark mode from localStorage
        function initializeDarkMode() {
          const savedDarkMode = localStorage.getItem("darkMode")
          if (savedDarkMode === "true") {
            isDarkMode = true
            document.body.setAttribute("data-theme", "dark")
            document.getElementById("darkModeIcon").className = "fas fa-sun"
          }
        }
        
        // Drag and drop handlers
        function handleDragOver(e) {
          e.preventDefault()
          uploadArea.classList.add("dragover")
        }
        
        function handleDragLeave(e) {
          e.preventDefault()
          uploadArea.classList.remove("dragover")
        }
        
        function handleDrop(e) {
          e.preventDefault()
          uploadArea.classList.remove("dragover")
        
          const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
          if (files.length > 0) {
            showUploadAnimation()
            setTimeout(() => {
              hideUploadAnimation()
              handleFiles(files)
            }, 2000)
          }
        }
        
        // File selection handler
        function handleFileSelect(e) {
          const files = Array.from(e.target.files)
          if (files.length > 0) {
            handleFiles(files)
          }
        }
        
        // Handle selected files
        function handleFiles(files) {
          selectedFiles = [...selectedFiles, ...files]
          displayPreview()
          previewSection.style.display = "block"
        }
        
        // Display upload preview
        function displayPreview() {
          previewGrid.innerHTML = ""
        
          selectedFiles.forEach((file, index) => {
            const reader = new FileReader()
            reader.onload = (e) => {
              const previewItem = createPreviewItem(e.target.result, file.name, index)
              previewGrid.appendChild(previewItem)
            }
            reader.readAsDataURL(file)
          })
        }
        
        // Create preview item
        function createPreviewItem(src, name, index) {
          const div = document.createElement("div")
          div.className = "preview-item"
          div.innerHTML = `
                <img src="${src}" alt="${name}">
                <button class="preview-close" onclick="removePreviewItem(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `
          return div
        }
        
        // Remove preview item
        function removePreviewItem(index) {
          selectedFiles.splice(index, 1)
          if (selectedFiles.length === 0) {
            previewSection.style.display = "none"
          } else {
            displayPreview()
          }
        }
        
        // Upload images (simulate backend upload)
        function uploadImages() {
          if (selectedFiles.length === 0) return
        
          // Simulate upload process
          const uploadBtn = document.querySelector(".upload-btn")
          const originalText = uploadBtn.innerHTML
          uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...'
          uploadBtn.disabled = true
        
          // Simulate API call delay
          setTimeout(() => {
            // Add uploaded images to gallery
            selectedFiles.forEach((file) => {
              const reader = new FileReader()
              reader.onload = (e) => {
                const imageData = {
                  id: Date.now() + Math.random(),
                  src: e.target.result,
                  name: file.name,
                  size: formatFileSize(file.size),
                  uploadDate: new Date(),
                  type: file.type,
                }
                uploadedImages.unshift(imageData)
                addImageToGallery(imageData)
              }
              reader.readAsDataURL(file)
            })
        
            // Reset upload state
            selectedFiles = []
            previewSection.style.display = "none"
            uploadBtn.innerHTML = originalText
            uploadBtn.disabled = false
            updateImageCount()
        
            // Show success message (you can implement a toast notification here)
            console.log("Images uploaded successfully!")
          }, 2000)
        }
        
        // Add image to gallery
        function addImageToGallery(imageData) {
          const galleryItem = createGalleryItem(imageData)
          galleryGrid.insertBefore(galleryItem, galleryGrid.firstChild)
        }
        
        // Create gallery item
        function createGalleryItem(imageData) {
          const div = document.createElement("div")
          div.className = "gallery-item"
          div.innerHTML = `
                <div class="image-container">
                    <img src="${imageData.src}" alt="${imageData.name}">
                    <div class="image-overlay">
                        <button class="overlay-btn" title="Download" onclick="downloadImage('${imageData.id}')">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="overlay-btn" title="Share" onclick="shareImage('${imageData.id}')">
                            <i class="fas fa-share"></i>
                        </button>
                        <button class="overlay-btn" title="Delete" onclick="deleteImage('${imageData.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="image-info">
                    <div class="image-name">${imageData.name}</div>
                    <div class="image-details">${imageData.size} • ${getTimeAgo(imageData.uploadDate)}</div>
                </div>
            `
          return div
        }
        
        // Show upload animation
        function showUploadAnimation() {
          uploadOverlay.classList.add("show")
        }
        
        // Hide upload animation
        function hideUploadAnimation() {
          uploadOverlay.classList.remove("show")
        }
        
        // Toggle profile dropdown
        function toggleProfileDropdown() {
          profileDropdown.classList.toggle("show")
        }
        
        // Toggle view (grid/list)
        function toggleView(view) {
          const isMobile = window.innerWidth <= 768
        
          // Prevent list view on mobile
          if (isMobile && view === "list") {
            return
          }
        
          const toggleBtns = document.querySelectorAll(".toggle-btn")
          toggleBtns.forEach((btn) => btn.classList.remove("active"))
          document.querySelector(`[data-view="${view}"]`).classList.add("active")
        
          if (view === "list") {
            galleryGrid.classList.add("list-view")
          } else {
            galleryGrid.classList.remove("list-view")
          }
        }
        
        // Search functionality
        function handleSearch(e) {
          const searchTerm = e.target.value.toLowerCase()
          const galleryItems = document.querySelectorAll(".gallery-item")
        
          galleryItems.forEach((item) => {
            const imageName = item.querySelector(".image-name").textContent.toLowerCase()
            if (imageName.includes(searchTerm)) {
              item.style.display = "block"
            } else {
              item.style.display = "none"
            }
          })
        }
        
        // Sort functionality
        function handleSort(e) {
          const sortBy = e.target.value
          const galleryItems = Array.from(document.querySelectorAll(".gallery-item"))
        
          galleryItems.sort((a, b) => {
            const nameA = a.querySelector(".image-name").textContent
            const nameB = b.querySelector(".image-name").textContent
        
            switch (sortBy) {
              case "name":
                return nameA.localeCompare(nameB)
              case "oldest":
                // For demo purposes, reverse the current order
                return -1
              case "newest":
              default:
                return 1
            }
          })
        
          // Re-append sorted items
          galleryItems.forEach((item) => galleryGrid.appendChild(item))
        }
        
        // Image actions
        function downloadImage(imageId) {
          const image = uploadedImages.find((img) => img.id == imageId)
          if (image) {
            const link = document.createElement("a")
            link.href = image.src
            link.download = image.name
            link.click()
          }
        }
        
        function shareImage(imageId) {
          // Implement share functionality
          console.log("Sharing image:", imageId)
          // You can integrate with Web Share API or show a share modal
        }
        
        function deleteImage(imageId) {
          if (confirm("Are you sure you want to delete this image?")) {
            // Remove from uploadedImages array
            uploadedImages = uploadedImages.filter((img) => img.id != imageId)
        
            // Remove from DOM
            const galleryItems = document.querySelectorAll(".gallery-item")
            galleryItems.forEach((item) => {
              const deleteBtn = item.querySelector('[onclick*="' + imageId + '"]')
              if (deleteBtn && deleteBtn.getAttribute("onclick").includes("deleteImage")) {
                item.remove()
              }
            })
        
            updateImageCount()
          }
        }
        
        // Utility functions
        function formatFileSize(bytes) {
          if (bytes === 0) return "0 Bytes"
          const k = 1024
          const sizes = ["Bytes", "KB", "MB", "GB"]
          const i = Math.floor(Math.log(bytes) / Math.log(k))
          return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
        }
        
        function getTimeAgo(date) {
          const now = new Date()
          const diffTime = Math.abs(now - date)
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
          if (diffDays === 1) return "1 day ago"
          if (diffDays < 7) return `${diffDays} days ago`
          if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? "s" : ""} ago`
          return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? "s" : ""} ago`
        }
        
        // Help modal toggle
        function toggleHelpModal() {
          const helpModal = document.getElementById("helpModal")
          helpModal.classList.toggle("show")
        }
        
        // Add keyboard shortcuts functionality
        document.addEventListener("keydown", (e) => {
          // Only trigger shortcuts when not typing in input fields
          if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
            return
          }
        
          switch (e.key.toLowerCase()) {
            case "d":
              if (!e.ctrlKey && !e.metaKey) {
                toggleDarkMode()
              }
              break
            case "g":
              if (!e.ctrlKey && !e.metaKey) {
                toggleView("grid")
              }
              break
            case "l":
              if (!e.ctrlKey && !e.metaKey) {
                toggleView("list")
              }
              break
            case "f":
              if (e.ctrlKey || e.metaKey) {
                e.preventDefault()
                document.querySelector(".search-input").focus()
              }
              break
            case "u":
              if (e.ctrlKey || e.metaKey) {
                e.preventDefault()
                uploadArea.click()
              }
              break
            case "escape":
              // Close modals and dropdowns
              document.getElementById("helpModal").classList.remove("show")
              document.getElementById("profileDropdown").classList.remove("show")
              document.getElementById("navMenu").classList.remove("show")
              break
          }
        })
        
        // Update the total images count in help modal
        function updateImageCount() {
          const totalImages = document.querySelectorAll(".gallery-item").length
          imageCount.textContent = `${totalImages} image${totalImages !== 1 ? "s" : ""}`
        
          // Update help modal count
          const helpModalCount = document.getElementById("totalImagesCount")
          if (helpModalCount) {
            helpModalCount.textContent = totalImages
          }
        }
        
        // Backend integration helpers (for when you implement the backend)
        async function uploadToServer(files) {
          const formData = new FormData()
          files.forEach((file) => {
            formData.append("images", file)
          })
        
          try {
            const response = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            })
        
            if (response.ok) {
              const result = await response.json()
              return result
            } else {
              throw new Error("Upload failed")
            }
          } catch (error) {
            console.error("Upload error:", error)
            throw error
          }
        }
        
        async function fetchImagesFromServer() {
          try {
            const response = await fetch("/api/images")
            if (response.ok) {
              const images = await response.json()
              return images
            } else {
              throw new Error("Failed to fetch images")
            }
          } catch (error) {
            console.error("Fetch error:", error)
            return []
          }
        }
        
        async function deleteImageFromServer(imageId) {
          try {
            const response = await fetch(`/api/images/${imageId}`, {
              method: "DELETE",
            })
        
            if (response.ok) {
              return true
            } else {
              throw new Error("Delete failed")
            }
          } catch (error) {
            console.error("Delete error:", error)
            return false
          }
        }
        
        async function deleteAccountFromServer() {
          try {
            const response = await fetch("/api/account", {
              method: "DELETE",
            })
        
            if (response.ok) {
              // Redirect to login page or show success message
              window.location.href = "/login"
              return true
            } else {
              throw new Error("Account deletion failed")
            }
          } catch (error) {
            console.error("Account deletion error:", error)
            return false
          }
        }
        
        // Handle responsive view changes
        function handleResponsiveView() {
          const isMobile = window.innerWidth <= 768
          const galleryGrid = document.getElementById("galleryGrid")
          const toggleBtns = document.querySelectorAll(".toggle-btn")
        
          if (isMobile) {
            // Force grid view on mobile for better UX
            galleryGrid.classList.remove("list-view")
            toggleBtns.forEach((btn) => btn.classList.remove("active"))
            document.querySelector('[data-view="grid"]').classList.add("active")
          }
        }