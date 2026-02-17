
        // BACKEND API URL
        const API_BASE = "http://localhost:5000/api";

        /**
         * STORE
         */
        const store = {
            books: [],
            currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
            token: localStorage.getItem("token") || null,

            async loadBooks() {
                try {
                    const res = await fetch(`${API_BASE}/books`);
                    const data = await res.json();
                    this.books = data || [];
                } catch (err) {
                    console.log(err);
                    this.books = [];
                }
            },

            saveSession(user, token) {
                this.currentUser = user;
                this.token = token;
                localStorage.setItem("currentUser", JSON.stringify(user));
                localStorage.setItem("token", token);
            },

            logout() {
                this.currentUser = null;
                this.token = null;
                localStorage.removeItem("currentUser");
                localStorage.removeItem("token");
            }
        };

        /**
         * ROUTER
         */
        const app = document.getElementById("app");

        const router = {
            currentPage: "home",

            async navigate(page, params = null) {
                window.scrollTo(0, 0);
                this.currentPage = page;
                ui.renderNavbar();

                switch(page) {
                    case "home":
                        ui.renderHome();
                        break;

                    case "browse":
                        ui.renderBrowse(params);
                        break;

                    case "details":
                        ui.renderDetails(params);
                        break;

                    case "login":
                        ui.renderLogin();
                        break;

                    case "register":
                        ui.renderRegister();
                        break;

                    case "dashboard":
                        if (!store.currentUser) return this.navigate("login");
                        ui.renderDashboard();
                        break;

                    case "post-book":
                        if (!store.currentUser) return this.navigate("login");
                        ui.renderPostBook();
                        break;

                    case "my-listings":
                        if (!store.currentUser) return this.navigate("login");
                        ui.renderMyListings();
                        break;

                    case "profile":
                        if (!store.currentUser) return this.navigate("login");
                        ui.renderProfile();
                        break;

                    default:
                        ui.renderHome();
                }
            }
        };

        /**
         * UI
         */
        const ui = {
            showToast(message, type = "success") {
                const toast = document.getElementById("toast");
                toast.innerText = message;

                toast.classList.remove("translate-y-20", "opacity-0");

                if (type === "error") toast.classList.replace("bg-gray-900", "bg-red-600");
                else toast.classList.replace("bg-red-600", "bg-gray-900");

                setTimeout(() => {
                    toast.classList.add("translate-y-20", "opacity-0");
                }, 3000);
            },

            openModal(contentHTML) {
                const modal = document.getElementById("modal-container");
                const content = document.getElementById("modal-content");
                content.innerHTML = contentHTML;
                modal.classList.remove("hidden");
            },

            closeModal() {
                document.getElementById("modal-container").classList.add("hidden");
            },

            renderNavbar() {
                const authContainer = document.getElementById("auth-links");
                const mobileAuthContainer = document.getElementById("mobile-auth-links");

                let desktopHTML = "";
                let mobileHTML = `
                    <a href="#" onclick="router.navigate('home')" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Home</a>
                    <a href="#" onclick="router.navigate('browse')" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Browse Books</a>
                `;

                if (store.currentUser) {
                    desktopHTML = `
                        <button onclick="router.navigate('post-book')" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm">Post a Book</button>
                        <div class="relative group">
                            <button class="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 focus:outline-none">
                                <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                    ${store.currentUser.name.charAt(0)}
                                </div>
                            </button>
                            <div class="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                                <a href="#" onclick="router.navigate('dashboard')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">Dashboard</a>
                                <a href="#" onclick="router.navigate('my-listings')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">My Listings</a>
                                <a href="#" onclick="router.navigate('profile')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">Profile</a>
                                <hr class="my-1 border-gray-100">
                                <a href="#" onclick="actions.logout()" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</a>
                            </div>
                        </div>
                    `;

                    mobileHTML += `
                        <a href="#" onclick="router.navigate('dashboard')" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Dashboard</a>
                        <a href="#" onclick="router.navigate('post-book')" class="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50">Post Book</a>
                        <a href="#" onclick="actions.logout()" class="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</a>
                    `;
                } else {
                    desktopHTML = `
                        <a href="#" onclick="router.navigate('login')" class="text-gray-600 hover:text-indigo-600 font-medium transition">Login</a>
                        <a href="#" onclick="router.navigate('register')" class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition">Register</a>
                    `;

                    mobileHTML += `
                        <a href="#" onclick="router.navigate('login')" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Login</a>
                        <a href="#" onclick="router.navigate('register')" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Register</a>
                    `;
                }

                authContainer.innerHTML = desktopHTML;
                mobileAuthContainer.innerHTML = mobileHTML;
            },

            renderHome() {
                const featuredBooks = store.books.slice(0, 4);

                app.innerHTML = `
                    <div class="fade-in">
                        <div class="bg-indigo-600 text-white py-20">
                            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                <h1 class="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                                    Buy, Sell or Exchange <br>Second-hand Books
                                </h1>
                                <p class="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
                                    Join the community of readers. Find books at affordable prices.
                                </p>

                                <div class="bg-white p-2 rounded-lg shadow-lg max-w-2xl mx-auto flex flex-col md:flex-row gap-2">
                                    <input type="text" id="home-search" placeholder="Search by title or author..."
                                        class="flex-grow px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <button onclick="actions.searchBooks('home-search')"
                                        class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md font-medium transition">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                            <h2 class="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
                            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                                ${["Engineering", "Medical", "Novels", "Competitive Exams", "Others"].map(cat => `
                                    <div onclick="router.navigate('browse', {category: '${cat}'})"
                                        class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 cursor-pointer text-center transition group">
                                        <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-600 group-hover:text-white transition">
                                            <i class="ph-bold ph-books text-xl"></i>
                                        </div>
                                        <h3 class="font-medium text-gray-900 group-hover:text-indigo-600">${cat}</h3>
                                    </div>
                                `).join("")}
                            </div>
                        </div>

                        <div class="bg-gray-50 py-16">
                            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div class="flex justify-between items-center mb-8">
                                    <h2 class="text-2xl font-bold text-gray-900">Featured Books</h2>
                                    <a href="#" onclick="router.navigate('browse')" class="text-indigo-600 font-medium hover:text-indigo-800">View All →</a>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    ${featuredBooks.length > 0
                                        ? featuredBooks.map(book => this.components.bookCard(book)).join("")
                                        : `<div class="col-span-full text-center text-gray-500 py-10">No books posted yet.</div>`
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },

            renderBrowse(filters = {}) {
                filters = filters || {};
                let filteredBooks = store.books;

                if (filters.category) {
                    filteredBooks = filteredBooks.filter(b => b.category === filters.category);
                }

                if (filters.query) {
                    const q = filters.query.toLowerCase();
                    filteredBooks = filteredBooks.filter(b =>
                        b.title.toLowerCase().includes(q) ||
                        b.author.toLowerCase().includes(q)
                    );
                }

                app.innerHTML = `
                    <div class="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div class="flex flex-col md:flex-row gap-8">

                            <div class="w-full md:w-64 flex-shrink-0">
                                <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm sticky top-24">
                                    <h3 class="font-bold text-gray-900 mb-4 flex items-center">
                                        <i class="ph ph-faders mr-2"></i> Filters
                                    </h3>

                                    <div class="mb-6">
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select id="filter-category" onchange="actions.applyFilters()"
                                            class="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 border">
                                            <option value="">All Categories</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Medical">Medical</option>
                                            <option value="Novels">Novels</option>
                                            <option value="Competitive Exams">Competitive Exams</option>
                                            <option value="Others">Others</option>
                                        </select>
                                    </div>

                                    <button onclick="router.navigate('browse')"
                                        class="w-full bg-gray-100 text-gray-600 py-2 rounded-md text-sm hover:bg-gray-200">
                                        Reset Filters
                                    </button>
                                </div>
                            </div>

                            <div class="flex-grow">
                                <div class="bg-white p-4 rounded-lg border border-gray-200 mb-6 flex items-center justify-between">
                                    <span class="text-gray-600 text-sm">Showing <strong>${filteredBooks.length}</strong> results</span>
                                    <div class="flex items-center space-x-2 w-1/2">
                                        <input type="text" id="browse-search" value="${filters.query || ""}" placeholder="Search books..."
                                            class="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:border-indigo-500">
                                        <button onclick="actions.searchBooks('browse-search')" class="bg-indigo-600 text-white p-1.5 rounded-md hover:bg-indigo-700">
                                            <i class="ph-bold ph-magnifying-glass"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    ${filteredBooks.length > 0
                                        ? filteredBooks.map(book => this.components.bookCard(book)).join("")
                                        : `<div class="col-span-full text-center py-20 text-gray-500">No books found.</div>`
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                if (filters.category) {
                    document.getElementById("filter-category").value = filters.category;
                }
            },

            renderDetails(id) {
                const book = store.books.find(b => b.id == id);
                if (!book) return router.navigate("browse");

                const sellerName = book.users?.name || "Unknown Seller";
                const sellerPhone = book.users?.phone || "";
                const sellerLocation = book.users?.location || "";

                app.innerHTML = `
                    <div class="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <button onclick="router.navigate('browse')" class="mb-6 text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                            <i class="ph-bold ph-arrow-left mr-1"></i> Back
                        </button>

                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div class="grid grid-cols-1 md:grid-cols-2">
                                <div class="h-96 md:h-auto bg-gray-100 relative group">
                                    <img src="${book.image || "https://placehold.co/400x500?text=Book"}" alt="${book.title}" class="w-full h-full object-cover">
                                </div>

                                <div class="p-8 md:p-12">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <span class="inline-block px-2 py-1 text-xs font-semibold rounded bg-indigo-100 text-indigo-800 mb-3">${book.category}</span>
                                            <h1 class="text-3xl font-bold text-gray-900 mb-2">${book.title}</h1>
                                            <p class="text-lg text-gray-600 mb-4">by ${book.author}</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-3xl font-bold text-indigo-600">₹${book.price}</p>
                                            <p class="text-sm text-gray-500">${book.condition}</p>
                                        </div>
                                    </div>

                                    <div class="border-t border-b border-gray-100 py-6 my-6">
                                        <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Description</h3>
                                        <p class="text-gray-700 leading-relaxed">${book.description || "No description provided."}</p>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4 mb-8">
                                        <div class="bg-gray-50 p-3 rounded-lg">
                                            <span class="block text-xs text-gray-500 uppercase">Location</span>
                                            <span class="font-medium text-gray-900"><i class="ph-fill ph-map-pin text-indigo-500 mr-1"></i> ${sellerLocation || book.location}</span>
                                        </div>
                                        <div class="bg-gray-50 p-3 rounded-lg">
                                            <span class="block text-xs text-gray-500 uppercase">Posted By</span>
                                            <span class="font-medium text-gray-900">${sellerName}</span>
                                        </div>
                                    </div>

                                    <div class="flex flex-col space-y-3">
                                        <button onclick="actions.contactSeller('${sellerPhone}')"
                                            class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition flex items-center justify-center">
                                            <i class="ph-bold ph-whatsapp-logo text-xl mr-2"></i> Contact Seller
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },

            renderLogin() {
                app.innerHTML = `
                    <div class="fade-in min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                        <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
                            <div class="text-center">
                                <h2 class="text-3xl font-bold text-gray-900">Welcome Back</h2>
                                <p class="mt-2 text-sm text-gray-600">Sign in to your account</p>
                            </div>
                            <form class="mt-8 space-y-6" onsubmit="event.preventDefault(); actions.login(this);">
                                <div class="rounded-md shadow-sm -space-y-px">
                                    <div class="mb-4">
                                        <input name="email" type="email" required class="rounded-lg w-full px-3 py-3 border border-gray-300" placeholder="Email address">
                                    </div>
                                    <div>
                                        <input name="password" type="password" required class="rounded-lg w-full px-3 py-3 border border-gray-300" placeholder="Password">
                                    </div>
                                </div>

                                <div>
                                    <button type="submit" class="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition">
                                        Sign in
                                    </button>
                                </div>
                            </form>
                            <div class="text-center">
                                <p class="text-sm text-gray-600">Don't have an account?
                                    <a href="#" onclick="router.navigate('register')" class="font-medium text-indigo-600 hover:text-indigo-500">Register here</a>
                                </p>
                            </div>
                        </div>
                    </div>
                `;
            },

            renderRegister() {
                app.innerHTML = `
                    <div class="fade-in min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                        <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
                            <div class="text-center">
                                <h2 class="text-3xl font-bold text-gray-900">Create Account</h2>
                                <p class="mt-2 text-sm text-gray-600">Join the community</p>
                            </div>
                            <form class="mt-8 space-y-4" onsubmit="event.preventDefault(); actions.register(this);">
                                <input name="name" type="text" required class="w-full px-3 py-3 border border-gray-300 rounded-lg" placeholder="Full Name">
                                <input name="email" type="email" required class="w-full px-3 py-3 border border-gray-300 rounded-lg" placeholder="Email Address">
                                <input name="phone" type="tel" required class="w-full px-3 py-3 border border-gray-300 rounded-lg" placeholder="Phone Number">
                                <input name="location" type="text" required class="w-full px-3 py-3 border border-gray-300 rounded-lg" placeholder="City/Location">
                                <input name="password" type="password" required class="w-full px-3 py-3 border border-gray-300 rounded-lg" placeholder="Password">
                                <input name="confirm_password" type="password" required class="w-full px-3 py-3 border border-gray-300 rounded-lg" placeholder="Confirm Password">

                                <button type="submit" class="w-full py-3 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition">
                                    Register
                                </button>
                            </form>
                            <div class="text-center">
                                <p class="text-sm text-gray-600">Already have an account?
                                    <a href="#" onclick="router.navigate('login')" class="font-medium text-indigo-600 hover:text-indigo-500">Login here</a>
                                </p>
                            </div>
                        </div>
                    </div>
                `;
            },

            renderDashboard() {
                const userBooks = store.books.filter(b => b.seller_id === store.currentUser.id);

                app.innerHTML = `
                    <div class="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <div class="mb-8">
                            <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p class="text-gray-600">Welcome back, <span class="font-semibold text-indigo-600">${store.currentUser.name}</span>!</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                            <div onclick="router.navigate('post-book')" class="bg-indigo-600 text-white p-6 rounded-xl shadow-md cursor-pointer hover:bg-indigo-700 transition">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="font-semibold text-lg">Post a Book</h3>
                                    <i class="ph-bold ph-plus-circle text-2xl"></i>
                                </div>
                                <p class="text-indigo-200 text-sm">Sell or exchange your old books.</p>
                            </div>

                            <div onclick="router.navigate('my-listings')" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-indigo-300 transition">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="font-semibold text-gray-900 text-lg">My Listings</h3>
                                    <span class="text-2xl font-bold text-indigo-600">${userBooks.length}</span>
                                </div>
                                <p class="text-gray-500 text-sm">Active listings</p>
                            </div>

                            <div onclick="router.navigate('profile')" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-indigo-300 transition">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="font-semibold text-gray-900 text-lg">Profile</h3>
                                    <i class="ph-bold ph-user-gear text-2xl text-gray-400"></i>
                                </div>
                                <p class="text-gray-500 text-sm">View your info</p>
                            </div>
                        </div>
                    </div>
                `;
            },

            renderPostBook() {
                app.innerHTML = `
                    <div class="fade-in max-w-3xl mx-auto px-4 py-10">
                        <div class="bg-white rounded-xl shadow-md border border-gray-100 p-8">
                            <h2 class="text-2xl font-bold text-gray-900 mb-6">Post a Book</h2>

                            <form onsubmit="event.preventDefault(); actions.postBook(this);" class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
                                        <input type="text" name="title" required class="w-full border-gray-300 rounded-lg p-3 border">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Author</label>
                                        <input type="text" name="author" required class="w-full border-gray-300 rounded-lg p-3 border">
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select name="category" class="w-full border-gray-300 rounded-lg p-3 border">
                                            <option>Engineering</option>
                                            <option>Medical</option>
                                            <option>Novels</option>
                                            <option>Competitive Exams</option>
                                            <option>Others</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                                        <select name="condition" class="w-full border-gray-300 rounded-lg p-3 border">
                                            <option>Like New</option>
                                            <option>Good</option>
                                            <option>Fair</option>
                                            <option>Poor</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                                        <input type="number" name="price" required class="w-full border-gray-300 rounded-lg p-3 border">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        <input type="text" name="location" value="${store.currentUser.location}" required class="w-full border-gray-300 rounded-lg p-3 border">
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Image URL (Optional)</label>
                                    <input type="url" name="image" placeholder="https://example.com/book.jpg" class="w-full border-gray-300 rounded-lg p-3 border">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea name="description" rows="4" class="w-full border-gray-300 rounded-lg p-3 border"></textarea>
                                </div>

                                <div class="flex justify-end space-x-3">
                                    <button type="button" onclick="router.navigate('dashboard')" class="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition">Cancel</button>
                                    <button type="submit" class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">Post Book</button>
                                </div>
                            </form>
                        </div>
                    </div>
                `;
            },

            renderMyListings() {
                const myBooks = store.books.filter(b => b.seller_id === store.currentUser.id);

                app.innerHTML = `
                    <div class="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <div class="flex justify-between items-center mb-8">
                            <h1 class="text-2xl font-bold text-gray-900">My Listings</h1>
                            <button onclick="router.navigate('post-book')" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">Add New</button>
                        </div>

                        <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    ${myBooks.length > 0 ? myBooks.map(book => `
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${book.title}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">₹${book.price}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">${book.category}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-right">
                                                <button onclick="actions.deleteBook('${book.id}')" class="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        </tr>
                                    `).join("") : `
                                        <tr>
                                            <td colspan="4" class="px-6 py-10 text-center text-gray-500">
                                                You haven't posted any books yet.
                                            </td>
                                        </tr>
                                    `}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            },

            renderProfile() {
                const u = store.currentUser;

                app.innerHTML = `
                    <div class="fade-in max-w-3xl mx-auto px-4 py-10">
                        <div class="bg-white rounded-xl shadow-md border border-gray-100 p-8">
                            <h2 class="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
                            <div class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm text-gray-500">Full Name</label>
                                        <div class="mt-1 p-2 bg-gray-50 rounded border border-gray-200">${u.name}</div>
                                    </div>
                                    <div>
                                        <label class="block text-sm text-gray-500">Email</label>
                                        <div class="mt-1 p-2 bg-gray-50 rounded border border-gray-200">${u.email}</div>
                                    </div>
                                    <div>
                                        <label class="block text-sm text-gray-500">Phone</label>
                                        <div class="mt-1 p-2 bg-gray-50 rounded border border-gray-200">${u.phone}</div>
                                    </div>
                                    <div>
                                        <label class="block text-sm text-gray-500">Location</label>
                                        <div class="mt-1 p-2 bg-gray-50 rounded border border-gray-200">${u.location}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },

            components: {
                bookCard(book) {
                    return `
                        <div onclick="router.navigate('details', '${book.id}')"
                            class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden book-card cursor-pointer h-full flex flex-col">
                            
                            <div class="h-48 overflow-hidden bg-gray-200 relative">
                                <img src="${book.image || "https://placehold.co/300x400?text=Book"}" alt="${book.title}" class="w-full h-full object-cover">
                                <div class="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800">
                                    ₹${book.price}
                                </div>
                            </div>

                            <div class="p-4 flex flex-col flex-grow">
                                <div class="text-xs text-indigo-600 font-semibold mb-1">${book.category}</div>
                                <h3 class="font-bold text-gray-900 mb-1 leading-tight truncate">${book.title}</h3>
                                <p class="text-sm text-gray-500 mb-2 truncate">by ${book.author}</p>

                                <div class="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center text-xs text-gray-500">
                                    <span class="flex items-center"><i class="ph-fill ph-map-pin mr-1"></i> ${book.location}</span>
                                    <span class="bg-gray-100 px-2 py-0.5 rounded text-gray-600">${book.condition}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
        };

        /**
         * ACTIONS
         */
        const actions = {
            async login(form) {
                const email = form.email.value;
                const password = form.password.value;

                const res = await fetch(`${API_BASE}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (!res.ok) {
                    ui.showToast(data.message || "Login failed", "error");
                    return;
                }

                store.saveSession(data.user, data.token);
                ui.showToast("Login Successful");
                await store.loadBooks();
                router.navigate("dashboard");
            },

            async register(form) {
                if (form.password.value !== form.confirm_password.value) {
                    ui.showToast("Passwords do not match", "error");
                    return;
                }

                const userData = {
                    name: form.name.value,
                    email: form.email.value,
                    phone: form.phone.value,
                    location: form.location.value,
                    password: form.password.value
                };

                const res = await fetch(`${API_BASE}/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData)
                });

                const data = await res.json();

                if (!res.ok) {
                    ui.showToast(data.message || "Register failed", "error");
                    return;
                }

                ui.showToast("Registered Successfully! Please login.");
                router.navigate("login");
            },

            logout() {
                store.logout();
                ui.showToast("Logged out");
                router.navigate("home");
            },

            async postBook(form) {
                const bookData = {
                    title: form.title.value,
                    author: form.author.value,
                    category: form.category.value,
                    condition: form.condition.value,
                    price: Number(form.price.value),
                    location: form.location.value,
                    image: form.image.value || "https://placehold.co/300x400?text=Book",
                    description: form.description.value
                };

                const res = await fetch(`${API_BASE}/books`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${store.token}`
                    },
                    body: JSON.stringify(bookData)
                });

                const data = await res.json();

                if (!res.ok) {
                    ui.showToast(data.message || "Failed to post book", "error");
                    return;
                }

                ui.showToast("Book Posted Successfully!");
                await store.loadBooks();
                router.navigate("my-listings");
            },

            async deleteBook(id) {
                if (!confirm("Are you sure you want to delete this book?")) return;

                const res = await fetch(`${API_BASE}/books/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${store.token}`
                    }
                });

                const data = await res.json();

                if (!res.ok) {
                    ui.showToast(data.message || "Delete failed", "error");
                    return;
                }

                ui.showToast("Book deleted!");
                await store.loadBooks();
                ui.renderMyListings();
            },

            searchBooks(inputId) {
                const query = document.getElementById(inputId).value;
                router.navigate("browse", { query });
            },

            applyFilters() {
                const category = document.getElementById("filter-category").value;
                router.navigate("browse", { category });
            },

            contactSeller(phone) {
                if (!store.currentUser) {
                    ui.showToast("Please login first", "error");
                    router.navigate("login");
                    return;
                }

                if (!phone) {
                    ui.showToast("Seller phone not available", "error");
                    return;
                }

                window.open(`https://wa.me/91${phone}?text=Hi, I am interested in your book on BookShare`, "_blank");
            }
        };

        // INIT
        window.addEventListener("DOMContentLoaded", async () => {
            document.getElementById("mobile-menu-btn").addEventListener("click", () => {
                document.getElementById("mobile-menu").classList.toggle("hidden");
            });

            await store.loadBooks();
            ui.renderNavbar();
            router.navigate("home");
        });