const viewSectionEl = document.getElementById("views");
const baseUrl = `http://localhost:3030/users`;
const baseUrlCatches = `http://localhost:3030/data/catches`;

function loadNavBar() {
    const accessToken = localStorage.getItem("accessToken");
    const email = localStorage.getItem("email");
    const navEl = document.querySelector("nav");

    if (accessToken) {
        navEl.innerHTML = `
                <a id="home" class="active">Home</a>
                <div id="user">
                    <a id="logout" href="javascript:void(0)">Logout</a>
                </div>
                <p class="email">Welcome, <span>${email}</span></p>;
                `;
    } else {
        navEl.innerHTML = `
                <a id="home" class="active">Home</a>
                <div id="guest">
                    <a id="login" href="#">Login</a>
                    <a id="register" href="#">Register</a>
                </div>
                <p class="email">Welcome, <span>guest</span></p> `;
    }

    const loginAEl = document.getElementById("login");
    const registerAEl = document.getElementById("register");
    const homeAEl = document.getElementById("home");
    const logoutAEl = document.getElementById("logout");

    registerAEl?.addEventListener("click", loadRegisterPage);
    loginAEl?.addEventListener("click", loadLoginPage);
    homeAEl?.addEventListener("click", loadHomePage);
    logoutAEl?.addEventListener("click", loadLogoutPage);
}

function loadRegisterPage() {
    viewSectionEl.innerHTML = "";

    const registerSectionViewEl = document.createElement("section");
    registerSectionViewEl.setAttribute("id", "register-view");

    const h2El = document.createElement("h2");
    h2El.textContent = "Register";

    const registerFormEl = document.createElement("form");
    registerFormEl.setAttribute("id", "register");

    const emailRegisterLabelEl = document.createElement("label");
    emailRegisterLabelEl.textContent = "Email: ";
    const inputEmailEl = document.createElement("input");
    inputEmailEl.type = "text";
    inputEmailEl.name = "email";
    emailRegisterLabelEl.appendChild(inputEmailEl);

    const passwordRegisterLabelEl = document.createElement("label");
    passwordRegisterLabelEl.textContent = "Password: ";
    const inputPasswordEl = document.createElement("input");
    inputPasswordEl.type = "password";
    inputPasswordEl.name = "password";
    passwordRegisterLabelEl.appendChild(inputPasswordEl);

    const repeatPasswordRegisterLabelEl = document.createElement("label");
    repeatPasswordRegisterLabelEl.textContent = "Password: ";
    const inputRePasswordEl = document.createElement("input");
    inputRePasswordEl.type = "password";
    inputRePasswordEl.name = "rePass";
    repeatPasswordRegisterLabelEl.appendChild(inputRePasswordEl);

    const notificationPEl = document.createElement("p");
    notificationPEl.classList = "notification";

    const registerBtnEl = document.createElement("button");
    registerBtnEl.textContent = "Register";

    registerFormEl.appendChild(emailRegisterLabelEl);
    registerFormEl.appendChild(passwordRegisterLabelEl);
    registerFormEl.appendChild(repeatPasswordRegisterLabelEl);
    registerFormEl.appendChild(notificationPEl);
    registerFormEl.appendChild(registerBtnEl);

    registerSectionViewEl.appendChild(h2El);
    registerSectionViewEl.appendChild(registerFormEl);

    viewSectionEl.appendChild(registerSectionViewEl);

    registerFormEl.addEventListener("submit", handleRegistrationForm);

    function handleRegistrationForm(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const userData = Object.fromEntries(formData);
        const email = userData.email;
        const password = userData.password;

        fetch(`${baseUrl}/register`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("id", data._id);
                localStorage.setItem("email", data.email);

                loadNavBar();
                loadHomePage();
            })
            .catch((err) => console.log(`There is an error: ${err}`));
    }
}

function loadLoginPage() {
    viewSectionEl.innerHTML = "";

    const loginViewSectionEl = document.createElement("section");
    loginViewSectionEl.id = "login-view";

    const h2El = document.createElement("h2");
    h2El.textContent = "Login";

    const loginFormEl = document.createElement("form");
    loginFormEl.id = "login";

    const emailLabelEl = document.createElement("label");
    emailLabelEl.textContent = "Email: ";
    const emailInputEl = document.createElement("input");
    emailInputEl.type = "text";
    emailInputEl.name = "email";
    emailLabelEl.appendChild(emailInputEl);

    const passwordLabelEl = document.createElement("label");
    passwordLabelEl.textContent = "Password: ";
    const passwordInputEl = document.createElement("input");
    passwordInputEl.type = "password";
    passwordInputEl.name = "password";
    passwordLabelEl.appendChild(passwordInputEl);

    const pNotficationEl = document.createElement("p");
    pNotficationEl.classList = "notification";

    const btnLoginEl = document.createElement("button");
    btnLoginEl.textContent = "Login";

    loginFormEl.appendChild(emailLabelEl);
    loginFormEl.appendChild(passwordLabelEl);
    loginFormEl.appendChild(pNotficationEl);
    loginFormEl.appendChild(btnLoginEl);

    loginViewSectionEl.appendChild(h2El);
    loginViewSectionEl.appendChild(loginFormEl);

    viewSectionEl.appendChild(loginViewSectionEl);

    loginFormEl.addEventListener("submit", handleLoginForm);

    function handleLoginForm(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const userData = Object.fromEntries(formData);

        fetch(`${baseUrl}/login`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((err) => {
                        throw new Error(err.message || "Login failed");
                    });
                }
                return res.json();
            })
            .then((data) => {
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("id", data._id);
                localStorage.setItem("email", data.email);

                loadNavBar();
                loadHomePage();
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

function loadHomePage() {
    viewSectionEl.innerHTML = "";
    const accessToken = localStorage.getItem("accessToken");

    const homeViewSectionEl = document.createElement("section");
    homeViewSectionEl.id = "home-view";

    const asideLoadInformation = document.createElement("aside");

    asideLoadInformation.innerHTML = `
                <button class="load">Load</button>
                <form id="addForm">
                    <fieldset>
                        <legend>Add Catch</legend>
                        <label>Angler</label>
                        <input type="text" name="angler" class="angler" ${
                            accessToken ? "" : "disabled"
                        }/>
                        <label>Weight</label>
                        <input type="number" name="weight" class="weight" ${
                            accessToken ? "" : "disabled"
                        }/>
                        <label>Species</label>
                        <input type="text" name="species" class="species" ${
                            accessToken ? "" : "disabled"
                        }/>
                        <label>Location</label>
                        <input type="text" name="location" class="location" ${
                            accessToken ? "" : "disabled"
                        }/>
                        <label>Bait</label>
                        <input type="text" name="bait" class="bait" ${
                            accessToken ? "" : "disabled"
                        }/>
                        <label>Capture Time</label>
                        <input type="number" name="captureTime" class="captureTime" ${
                            accessToken ? "" : "disabled"
                        }/>
                        <button class="add"${
                            accessToken ? "" : "disabled"
                        }>Add</button>
                    </fieldset>
                </form>
                `;

    const mainFieldsetEl = document.createElement("fieldset");
    mainFieldsetEl.id = "main";
    const legendEl = document.createElement("legend");
    legendEl.textContent = "Catches";
    const catchesDivEl = document.createElement("catches");
    catchesDivEl.id = "catches";
    mainFieldsetEl.appendChild(legendEl);
    mainFieldsetEl.appendChild(catchesDivEl);
    homeViewSectionEl.appendChild(mainFieldsetEl);
    fetch(baseUrlCatches)
        .then((res) => res.json())
        .then((usersData) => {
            for (const eachUserData of usersData) {
                const userId = localStorage.getItem("id");
                const isOwner = eachUserData._ownerId === userId;

                const catchDivEl = document.createElement("div");
                catchDivEl.classList = "catch";
                catchDivEl.innerHTML = `
                        <label>Angler</label>
                        <input type="text" class="angler" value="${
                            eachUserData.angler
                        }" ${isOwner ? "" : "disabled"}>
                        <label>Weight</label>
                        <input type="text" class="weight" value="${
                            eachUserData.weight
                        }" ${isOwner ? "" : "disabled"}>
                        <label>Species</label>
                        <input type="text" class="species" value="${
                            eachUserData.species
                        }" ${isOwner ? "" : "disabled"}>
                        <label>Location</label>
                        <input type="text" class="location" value="${
                            eachUserData.location
                        }" ${isOwner ? "" : "disabled"}>
                        <label>Bait</label>
                        <input type="text" class="bait" value="${
                            eachUserData.bait
                        }" ${isOwner ? "" : "disabled"}>
                        <label>Capture Time</label>
                        <input type="number" class="captureTime" value="${
                            eachUserData.captureTime
                        }" ${isOwner ? "" : "disabled"}>
                        <button class="update" data-id="${eachUserData._id}" ${
                    isOwner ? "" : "disabled"
                }
                }
                }">Update</button>
                        <button class="delete" data-id="${eachUserData._id}" ${
                    isOwner ? "" : "disabled"
                }
                }">Delete</button>
                        `;
                catchesDivEl.appendChild(catchDivEl);

                const updateBtnEl = catchDivEl.querySelector(".update");
                const deleteBtnEl = catchDivEl.querySelector(".delete");
                updateBtnEl.addEventListener("click", handleUpdateBtn);
                deleteBtnEl.addEventListener("click", handleDeleteBtn);

                function handleUpdateBtn(e) {
                    const currentCatchDivEl = e.currentTarget.parentNode;
                    const angler =
                        currentCatchDivEl.querySelector(".angler").value;
                    const weight =
                        currentCatchDivEl.querySelector(".weight").value;
                    const species =
                        currentCatchDivEl.querySelector(".species").value;
                    const location =
                        currentCatchDivEl.querySelector(".location").value;
                    const bait = currentCatchDivEl.querySelector(".bait").value;
                    const captureTime =
                        currentCatchDivEl.querySelector(".captureTime").value;

                    fetch(`${baseUrlCatches}/${eachUserData._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-type": "application/json",
                            "X-Authorization": accessToken,
                        },
                        body: JSON.stringify({
                            angler,
                            weight,
                            species,
                            location,
                            bait,
                            captureTime,
                        }),
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            console.log("The new update is: ", data);
                        })
                        .catch((err) => console.log(err));

                    loadHomePage();
                }

                function handleDeleteBtn(e) {
                    fetch(`${baseUrlCatches}/${eachUserData._id}`, {
                        method: "DELETE",
                        headers: {
                            "X-Authorization": accessToken,
                        },
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            console.log("The delete is: ", data);
                        })
                        .then(() => loadHomePage())
                        .catch((err) => console.log(err));
                }

                const loadButtonEl = document.querySelector(".load");
                loadButtonEl.addEventListener("click", loadHomePage);
            }
        })
        .catch((err) => console.log(`There is an error: ${err}`));

    homeViewSectionEl.appendChild(asideLoadInformation);
    viewSectionEl.appendChild(homeViewSectionEl);

    const addFormEl = document.getElementById("addForm");
    addFormEl.addEventListener("submit", handleAddForm);
    function handleAddForm(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const userData = Object.fromEntries(formData);
        console.log(userData);

        fetch(baseUrlCatches, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-Authorization": accessToken,
            },
            body: JSON.stringify(userData),
        }).then(() => loadHomePage());
    }
}

function loadLogoutPage() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("email");
    localStorage.removeItem("id");

    loadNavBar();
    loadHomePage();
}

loadNavBar();
loadHomePage();
