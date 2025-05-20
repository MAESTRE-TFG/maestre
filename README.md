<p align="center">
    <img src="https://github.com/MAESTRE-TFG/maestre/raw/main/frontend/static/maestrito/maestrito_jump_transparent.webp" alt="Logo Maestre" width="200" />
</p>
<p align="center"><h1 align="center">MAESTRE</h1></p>
<p align="center">
	<em><code>The best workplace experience for secondary and high school teachers powered by ARTIFICIAL INTELLIGENCE</code></em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/MAESTRE-TFG/maestre?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/MAESTRE-TFG/maestre?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/MAESTRE-TFG/maestre?style=default&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/MAESTRE-TFG/maestre?style=default&color=0080ff" alt="repo-language-count">
</p>
<p align="center">
	<strong> 🤠 ¡GET ACCESS TO OUR APP HERE! 👉 https://maestre.netlify.app/ 😮 </strong>
	<br>
</p>

---


<!-- Language Switch -->
[🇬🇧 English](#english) | [🇪🇸 Español](#español)</b>

<p align="center">
	<br>
	<br>
	<br>
	<br>
</p>


---

#  MEET MAESTRE! - ENGLISH VERSION

- [MEET MAESTRE! - ENGLISH VERSION](#meet-maestre---english-version)
	- [Overview](#overview)
	- [Features](#features)
	- [Project Structure](#project-structure)
		- [Project Index](#project-index)
	- [Local deployment](#local-deployment)
		- [Prerequisites](#prerequisites)
		- [Installation](#installation)
		- [Usage](#usage)
		- [Testing](#testing)
	- [Project Roadmap](#project-roadmap)
	- [Contributing](#contributing)
	- [License](#license)
	- [Acknowledgments](#acknowledgments)
- [¡CONOCE MAESTRE! - VERSIÓN EN ESPAÑOL](#conoce-maestre---versión-en-español)
	- [Descripción General](#descripción-general)
	- [Características](#características)
	- [Estructura del proyecto](#estructura-del-proyecto)
		- [Índice del proyecto](#índice-del-proyecto)
		- [Índice del Proyecto](#índice-del-proyecto-1)
	- [Despliegue local](#despliegue-local)
		- [Requisitos previos](#requisitos-previos)
		- [Instalación](#instalación)
		- [Uso](#uso)
		- [Pruebas](#pruebas)
	- [Hoja de ruta del proyecto](#hoja-de-ruta-del-proyecto)
	- [Contribuir](#contribuir)
	- [Licencia](#licencia)
	- [Agradecimientos](#agradecimientos)

---


<div id="english">


##  Overview

*MAESTRE is a cutting-edge web application leveraging artificial intelligence to enhance the workplace experience for secondary and high school teachers. By streamlining administrative tasks and providing data-driven insights, it empowers educators to focus on what matters most—teaching.*

Check out our [USER GUIDE](https://documentation-maestre.netlify.app/) for a more detailed overview of this project!


---

##  Features

🌐 AI-Powered Educator Tools

- Intelligent document translation for multilingual classrooms
- Automated exam/test creation and correction via ChatGPT API
- Customizable templates for assessments
- Interactive lesson and activity scheduling


🎨 Modern & Accessible Interface

- Neomorphism-inspired design for a sleek, intuitive experience
- Responsive layouts optimized for both web and mobile platforms
- User-centric navigation with customizable themes
- Accessible design ensuring ease of use for all educators


🛠 Performance & Testing

- Comprehensive unit, integration, and load testing
- Continuous evaluation of AI model performance
- Seamless integration with external LLM APIs

---

##  Project Structure

```sh
└── maestre/
    ├── .github/
    │   ├── ISSUE_TEMPLATE
    │   └── PULL_REQUEST_TEMPLATE.md
    ├── CONTRIBUTING.md
    ├── LICENSE
    ├── README.md
    ├── backend/
    │   ├── api/
    │   ├── backend/
    │   ├── classrooms/
    │   ├── materials/
    │   ├── media/
    │   ├── schools/
    │   ├── students/
    │   ├── tags/
    │   └── users/
    └── frontend/
    	├── public/
    	├── src/
    	└── static/
```


###  Project Index

<details open>
	<summary><b><code>MAESTRE/</code></b></summary>
	<!-- .github Submodule -->
	<details>
		<summary><b>.github</b></summary>
		<blockquote>
			<details>
				<summary><b>ISSUE_TEMPLATE</b></summary>
				<blockquote>
					<tr>
						<td><code>❯ Contains the issue template(s) used for reporting bugs and requesting features.</code></td>
					</tr>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<!-- backend Submodule -->
	<details>
		<summary><b>backend</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/backend/.coverage'>.coverage</a></b></td>
				<td><code>❯ Generated file storing code coverage data from tests.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/backend/manage.py'>manage.py</a></b></td>
				<td><code>❯ Django management script for administrative tasks.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/backend/requirements.txt'>requirements.txt</a></b></td>
				<td><code>❯ List of Python dependencies required for the backend.</code></td>
			</tr>
			</table>
			<details>
				<summary><b>api</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Contains API endpoints (likely using Django REST Framework) exposing backend services.</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>backend</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/backend/backend/urls.py'>urls.py</a></b></td>
						<td><code>❯ URL configuration mapping routes to views for the Django project.</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/backend/backend/wsgi.py'>wsgi.py</a></b></td>
						<td><code>❯ WSGI entry point used by production servers to serve the Django app.</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/backend/backend/asgi.py'>asgi.py</a></b></td>
						<td><code>❯ ASGI entry point enabling asynchronous support.</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/backend/backend/settings.py'>settings.py</a></b></td>
						<td><code>❯ Django settings file containing configuration for database, apps, middleware, etc.</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>classrooms</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Contains the Django app/module for managing classroom-related data and views.</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>materials</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Modules related to managing materials or resources (e.g. inventory) in the application.</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>schools</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Contains the Django app/module handling school-related models, views, and functionality.</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>students</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Contains functionality related to student management within the backend.</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>tags</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Contains functionality related to materials' tags.</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>users</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Contains the Django app/module handling user models, authentication, and related views.</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<!-- frontend Submodule -->
	<details>
		<summary><b>frontend</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/next.config.mjs'>next.config.mjs</a></b></td>
				<td><code>❯ Next.js configuration file (ES module format) for custom settings.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/components.json'>components.json</a></b></td>
				<td><code>❯ JSON configuration listing or defining reusable frontend components.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/postcss.config.mjs'>postcss.config.mjs</a></b></td>
				<td><code>❯ PostCSS configuration file using ES module syntax.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/eslint.config.mjs'>eslint.config.mjs</a></b></td>
				<td><code>❯ ESLint configuration file (ES module format) for linting rules.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/package.json'>package.json</a></b></td>
				<td><code>❯ Manifest file for the frontend project (dependencies and scripts).</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/jsconfig.json'>jsconfig.json</a></b></td>
				<td><code>❯ JavaScript configuration for editor IntelliSense and module resolution.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/tailwind.config.mjs'>tailwind.config.mjs</a></b></td>
				<td><code>❯ Tailwind CSS configuration (ES module version).</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/tailwind.config.js'>tailwind.config.js</a></b></td>
				<td><code>❯ Tailwind CSS configuration (CommonJS version).</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/package-lock.json'>package-lock.json</a></b></td>
				<td><code>❯ Npm package lock file ensuring consistent dependency versions.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/next.config.js'>next.config.js</a></b></td>
				<td><code>❯ Next.js configuration file (CommonJS format) for fallback settings.</code></td>
			</tr>
			</table>
			<details>
				<summary><b>src</b></summary>
				<blockquote>
					<details>
						<summary><b>context</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/context/ErrorContext.js'>ErrorContext.js</a></b></td>
								<td><code>❯ Provides a React context for managing error states application-wide.</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>hooks</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/hooks/use-outside-click.jsx'>use-outside-click.jsx</a></b></td>
								<td><code>❯ Custom hook that detects clicks outside a designated element.</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>lib</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/lib/utils.js'>utils.js</a></b></td>
								<td><code>❯ Utility functions used across the frontend application.</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>components</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/student-create-form.jsx'>student-create-form.jsx</a></b></td>
								<td><code>❯ Form component for creating new student profiles.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/theme-provider.jsx'>theme-provider.jsx</a></b></td>
								<td><code>❯ Component providing theming context and configuration.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/file-upload-demo.jsx'>file-upload-demo.jsx</a></b></td>
								<td><code>❯ Demo component showcasing file upload functionality.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/card-carrousell.jsx'>card-carrousell.jsx</a></b></td>
								<td><code>❯ Carousel component for displaying cards in a sliding view.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/school-create-form.jsx'>school-create-form.jsx</a></b></td>
								<td><code>❯ Form component for creating a new school profile.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/complete-profile-form.jsx'>complete-profile-form.jsx</a></b></td>
								<td><code>❯ Form component for completing user profile details.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/signup-form-demo.jsx'>signup-form-demo.jsx</a></b></td>
								<td><code>❯ Demo component for user signup functionality.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/classroom-create-form.jsx'>classroom-create-form.jsx</a></b></td>
								<td><code>❯ Form component for creating a new classroom.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/aurora-background-demo.jsx'>aurora-background-demo.jsx</a></b></td>
								<td><code>❯ Demo component showcasing an animated aurora background.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/profile-edit-form.jsx'>profile-edit-form.jsx</a></b></td>
								<td><code>❯ Form component for editing user profile information.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/signin-form-demo.jsx'>signin-form-demo.jsx</a></b></td>
								<td><code>❯ Demo component for user sign-in functionality.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/sidebar-demo.jsx'>sidebar-demo.jsx</a></b></td>
								<td><code>❯ Demo component showcasing a sidebar navigation interface.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/classroom-edit-form.jsx'>classroom-edit-form.jsx</a></b></td>
								<td><code>❯ Form component for editing classroom details.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/macbook-scroll.jsx'>macbook-scroll.jsx</a></b></td>
								<td><code>❯ Component that simulates a MacBook scrolling effect.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/theme-switch.jsx'>theme-switch.jsx</a></b></td>
								<td><code>❯ Toggle component for switching between themes (e.g., light/dark mode).</code></td>
							</tr>
							</table>
							<details>
								<summary><b>ui</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/ui/label.jsx'>label.jsx</a></b></td>
										<td><code>❯ UI component for displaying form or text labels.</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/ui/modal.js'>modal.js</a></b></td>
										<td><code>❯ UI component for modal dialogs.</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/ui/sidebar.jsx'>sidebar.jsx</a></b></td>
										<td><code>❯ Reusable UI sidebar component.</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/ui/input.jsx'>input.jsx</a></b></td>
										<td><code>❯ UI input field component.</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/ui/apple-cards-carousel.jsx'>apple-cards-carousel.jsx</a></b></td>
										<td><code>❯ Carousel component with an Apple-inspired design.</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/ui/macbook-scroll.jsx'>macbook-scroll.jsx</a></b></td>
										<td><code>❯ Alternative UI version of the MacBook scroll effect.</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/ui/file-upload.jsx'>file-upload.jsx</a></b></td>
										<td><code>❯ UI component for handling file uploads.</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>app</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/app/layout.js'>layout.js</a></b></td>
								<td><code>❯ Root layout component defining the overall page structure.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/app/page.js'>page.js</a></b></td>
								<td><code>❯ Main landing page component of the application.</code></td>
							</tr>
							<details>
								<summary><b>schools</b></summary>
								<blockquote>
									<details>
										<summary><b>new</b></summary>
										<blockquote>
											<table>
											<tr>
												<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/app/schools/new/page.js'>page.js</a></b></td>
												<td><code>❯ Page component for creating a new school entry.</code></td>
											</tr>
											</table>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
				</blockquote>
			</details>
		</blockquote>
	</details>
</details>


---
##  Local deployment


###  Prerequisites

Before getting started with FISIOFIND, ensure your runtime environment meets the following requirements:

- **Programming Language:** [Python](https://www.python.org/)
- **Package Manager:** [Npm](https://www.npmjs.com/), [Pip](https://pypi.org/project/pip/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **LLM:** [Ollama](https://ollama.com/) -> [llama3.2-3b](https://ollama.com/library/llama3.2) and [deepseek-r1](https://ollama.com/library/deepseek-r1)


###  Installation

Install FISIOFIND using one of the following methods:

**Build from source:**

1. Clone the FISIOFIND repository:
```sh
❯ git clone https://github.com/MAESTRE-TFG/maestre
```

2. Navigate to the project directory:
```sh
❯ cd maestre
```

3. Install the project dependencies:

**Using `pip`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Pip-3776AB.svg?style={badge_style}&logo=pypi&logoColor=white" />](https://pypi.org/project/pip/)

First, create and activate a Python virtual environment in the backend directory:

```sh
❯ cd backend
❯ python -m venv venv
❯ source venv/bin/activate
```
Then we proceed to install the dependencies:

```sh
❯ pip install -r requirements.txt
```
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" />](https://www.npmjs.com/)

We now install the frontend framework dependencies in the `frontend` directory:

```sh
❯ cd ../fronend
❯ npm install
```

###  Usage

The first time the project is locally deployed, we need to create a .env filed in the `backend` directory according to the `.env.example` file.

To run the backend server, follow these steps on the `backend` directory **and with the venv activated**:

```sh
❯ cd .\backend
❯ python .\manage.py makemigrations
❯ python .\manage.py migrate
❯ python .\manage.py runserver
```
Additionaly, the first time the project is locally deployed, we need to create a superuser to access the admin panel:

```sh
❯ python.\manage.py createsuperuser
```

After the local backend server is running, we can run the frontend server **in a new terminal window**:

**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ cd ../../fronted
❯ npm run dev
```

###  Testing
Run the test suite using the following command:

**Using `pip`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Pip-3776AB.svg?style={badge_style}&logo=pypi&logoColor=white" />](https://pypi.org/project/pip/)

```sh
❯ run manage.py test
```

Or choose an specific module to test using:

```sh
❯ run manage.py test [module]
```

For a detailed coverage study:

```sh
❯ coverage run manage.py test [module]
❯ coverage report
❯ coverage html
```


---
##  Project Roadmap

**Sprint 1**
- [X] **`Task 1.1`**: User management - signin/login/logout/edit
- [X] **`Task 1.2`**: Classroom functionality
- [X] **`Task 1.3`**: Students management
- [X] **`Task 1.4`**: Base interface - Home
- [X] **`Task 1.5`**: First unit testing

**Sprint 2**
- [X] **`Task 2.1`**: Materials management (replanned from Sprint 1)
- [X] **`Task 2.2`**: **Exam generation tool**
- [X] **`Task 2.3`**: Styled interface
- [X] **`Task 2.4`**: Complete unit test suite (replanned from Sprint 1)

**Sprint 3**

- [X] **`Task 3.1`**: Error management  (replanned from Sprint 2)
- [X] **`Task 3.2`**: User policy & terms management
- [X] **`Task 3.3`**: **Planning tool**
- [X] **`Task 3.4`**: Exam generation tool testing & improovements

**Sprint 4**

- [X] **`Task 4.1`**: Traduction tool
- [X] **`Task 4.2`**: Planner tool
- [X] **`Task 4.3`**: Final Testing report

---

##  Contributing

- **🐛 [Report Issues](https://github.com/MAESTRE-TFG/maestre/issues)**: Submit bugs found or log feature requests for the `maestre.git` project.

- **💡 [Submit Pull Requests](https://github.com/MAESTRE-TFG/maestre/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

<details closed>
<summary>Contributing Guidelines</summary>


1. **Fork the Repository**: Start by forking the project repository to your github account.

2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/MAESTRE-TFG/maestre
   ```

3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b feat/new-feature-x
   ```

4. **Make Your Changes**: Develop and *test* your changes locally.

5. **Commit Your Changes**: Commit with a clear message describing your updates following the *conventional commits* standards and trying to make them as '*atomic*' as possible.
   ```sh
   git commit -m 'Feat: Implemented new feature x.'
   ```

6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin feat/new-feature-x
   ```

7. **Submit a Pull Request**: Create a PR against the original project repository pointing to the develop branch. **Clearly describe the changes and their motivations using the provided template**.

8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
	<summary>Contributor Graph</summary>
	<br>
	<p align="left"> <a href="https://github.com/MAESTRE-TFG/maestre/graphs/contributors">
	<img src="https://contrib.rocks/image?repo=MAESTRE-TFG/maestre"> </a> </p>
</details>

---

##  License

This project is protected under the [MIT License](https://choosealicense.com/licenses/mit/) License. For more details, refer to the [LICENSE](LICENSE) file.

---

##  Acknowledgments

Antonio Macías and Rafael Pulido, the two creators of this project:

<table>
    <td align="center">
        <a href="https://github.com/antoniommff">
            <img src="https://avatars.githubusercontent.com/u/91947070?v=4" width="100px;" alt="Antonio Macías"/>
            <br />
		            <sub><b>Antonio Macías</b></sub>
            <sub><b>Project Manager, Analyst Developer, Software Engineer</b></sub>
        </a>
	</td>
    <td align="center">
        <a href="https://github.com/rafpulcif">
            <img src="https://avatars.githubusercontent.com/u/91948036?v=4" width="100px;" alt="Rafael Pulido"/>
            <br />
            <sub><b>Rafael Pulido</b></sub>
			<sub><b>Analyst Developer, Software Engineer</b></sub>
        </a>
    </td>
</table>

---

<p align="center">
	<br>
	<br>
	<br>
	<br>
	<img src="https://github.com/MAESTRE-TFG/maestre/raw/main/frontend/static/maestrito/maestrito_jump_transparent.webp" alt="Logo Maestre" width="200" />
</p>
<p align="center"><h1 align="center">MAESTRE</h1></p>

<div id="español">

<p align="center">
	<em><code>La mejor experiencia para profesores de secundaria y bachillerato impulsada por INTELIGENCIA ARTIFICIAL</code></em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/MAESTRE-TFG/maestre?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="licencia">
	<img src="https://img.shields.io/github/last-commit/MAESTRE-TFG/maestre?style=default&logo=git&logoColor=white&color=0080ff" alt="último-commit">
	<img src="https://img.shields.io/github/languages/top/MAESTRE-TFG/maestre?style=default&color=0080ff" alt="lenguaje-principal-repo">
	<img src="https://img.shields.io/github/languages/count/MAESTRE-TFG/maestre?style=default&color=0080ff" alt="conteo-lenguajes-repo">
</p>
<p align="center">
	<strong> 🤠 ¡ACCDE A NUESTRA APP AQUÍ! 👉 https://maestre.netlify.app/ 😮 </strong>
</p>
<br>

---



# ¡CONOCE MAESTRE! - VERSIÓN EN ESPAÑOL

## Descripción General

*MAESTRE es una aplicación web de vanguardia que aprovecha la inteligencia artificial para mejorar la experiencia laboral de los profesores de secundaria y bachillerato. Al agilizar tareas administrativas y proporcionar información basada en datos, permite a los educadores centrarse en lo más importante: la enseñanza.*

Consulta nuestra [GUÍA DE USUARIO](https://documentation-maestre.netlify.app/) para una visión más detallada de este proyecto.

---

## Características

🌐 Herramientas Educativas Impulsadas por IA

- Traducción inteligente de documentos para aulas multilingües
- Creación y corrección automática de exámenes/pruebas mediante la API de ChatGPT
- Plantillas personalizables para evaluaciones
- Programación interactiva de lecciones y actividades

🎨 Interfaz Moderna y Accesible

- Diseño inspirado en el neomorfismo para una experiencia elegante e intuitiva
- Disposición adaptable y optimizada para web y dispositivos móviles
- Navegación centrada en el usuario con temas personalizables
- Diseño accesible para facilitar el uso a todos los educadores

🛠 Rendimiento y Pruebas

- Pruebas unitarias, de integración y de carga exhaustivas
- Evaluación continua del rendimiento de los modelos de IA
- Integración fluida con APIs externas de LLM

---


##  Estructura del proyecto

```sh
└── maestre/
    ├── .github/
    │   ├── ISSUE_TEMPLATE
    │   └── PULL_REQUEST_TEMPLATE.md
    ├── CONTRIBUTING.md
    ├── LICENSE
    ├── README.md
    ├── backend/
    │   ├── api/
    │   ├── backend/
    │   ├── classrooms/
    │   ├── materials/
    │   ├── media/
    │   ├── schools/
    │   ├── students/
    │   ├── tags/
    │   └── users/
    └── frontend/
    	├── public/
    	├── src/
    	└── static/
```


###  Índice del proyecto

###  Índice del Proyecto

<details open>
	<summary><b><code>MAESTRE/</code></b></summary>
	<!-- .github Submodule -->
	<details>
		<summary><b>.github</b></summary>
		<blockquote>
			<details>
				<summary><b>ISSUE_TEMPLATE</b></summary>
				<blockquote>
					<tr>
						<td><code>❯ Contiene la(s) plantilla(s) de incidencias utilizadas para reportar errores y solicitar nuevas funcionalidades.</code></td>
					</tr>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<!-- backend Submodule -->
	<details>
		<summary><b>backend</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/backend/.coverage'>.coverage</a></b></td>
				<td><code>❯ Archivo generado que almacena datos de cobertura de código de las pruebas.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/backend/manage.py'>manage.py</a></b></td>
				<td><code>❯ Script de gestión de Django para tareas administrativas.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/backend/requirements.txt'>requirements.txt</a></b></td>
				<td><code>❯ Lista de dependencias de Python requeridas para el backend.</code></td>
			</tr>
			</table>
			<details>
				<summary><b>api</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Contiene endpoints de API (probablemente usando Django REST Framework) que exponen servicios del backend.</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>backend</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/backend/backend/urls.py'>urls.py</a></b></td>
						<td><code>❯ Configuración de URL que mapea rutas a vistas para el proyecto Django.</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/backend/backend/wsgi.py'>wsgi.py</a></b></td>
						<td><code>❯ Punto de entrada WSGI utilizado por servidores de producción para servir la aplicación Django.</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/backend/backend/asgi.py'>asgi.py</a></b></td>
						<td><code>❯ Punto de entrada ASGI que habilita soporte asíncrono.</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/backend/backend/settings.py'>settings.py</a></b></td>
						<td><code>❯ Archivo de configuración de Django que contiene la configuración para base de datos, aplicaciones, middleware, etc.</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>classrooms</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Contiene la aplicación/módulo de Django para gestionar datos y vistas relacionadas con las aulas.</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>materials</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Módulos relacionados con la gestión de materiales o recursos (por ejemplo, inventario) en la aplicación.</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>schools</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Contiene la aplicación/módulo de Django para manejar modelos, vistas y funcionalidades relacionadas con las escuelas.</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>students</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Contiene funcionalidad relacionada con la gestión de estudiantes dentro del backend.</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>tags</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Contiene funcionalidad relacionada con las etiquetas de materiales.</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>users</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Contiene la aplicación/módulo de Django que maneja modelos de usuarios, autenticación y vistas relacionadas.</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<!-- frontend Submodule -->
	<details>
		<summary><b>frontend</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/next.config.mjs'>next.config.mjs</a></b></td>
				<td><code>❯ Archivo de configuración de Next.js (formato módulo ES) para configuraciones personalizadas.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/components.json'>components.json</a></b></td>
				<td><code>❯ Configuración JSON que lista o define componentes reutilizables del frontend.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/postcss.config.mjs'>postcss.config.mjs</a></b></td>
				<td><code>❯ Archivo de configuración de PostCSS usando sintaxis de módulo ES.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/eslint.config.mjs'>eslint.config.mjs</a></b></td>
				<td><code>❯ Archivo de configuración de ESLint (formato módulo ES) para reglas de linting.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/package.json'>package.json</a></b></td>
				<td><code>❯ Archivo de manifiesto para el proyecto frontend (dependencias y scripts).</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/jsconfig.json'>jsconfig.json</a></b></td>
				<td><code>❯ Configuración de JavaScript para IntelliSense del editor y resolución de módulos.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/tailwind.config.mjs'>tailwind.config.mjs</a></b></td>
				<td><code>❯ Configuración de Tailwind CSS (versión módulo ES).</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/tailwind.config.js'>tailwind.config.js</a></b></td>
				<td><code>❯ Configuración de Tailwind CSS (versión CommonJS).</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/package-lock.json'>package-lock.json</a></b></td>
				<td><code>❯ Archivo de bloqueo de paquetes Npm que garantiza versiones consistentes de dependencias.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/next.config.js'>next.config.js</a></b></td>
				<td><code>❯ Archivo de configuración de Next.js (formato CommonJS) para configuraciones alternativas.</code></td>
			</tr>
			</table>
			<details>
				<summary><b>src</b></summary>
				<blockquote>
					<details>
						<summary><b>context</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/context/ErrorContext.js'>ErrorContext.js</a></b></td>
								<td><code>❯ Proporciona un contexto React para gestionar estados de error en toda la aplicación.</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>hooks</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/hooks/use-outside-click.jsx'>use-outside-click.jsx</a></b></td>
								<td><code>❯ Hook personalizado que detecta clics fuera de un elemento designado.</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>lib</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/lib/utils.js'>utils.js</a></b></td>
								<td><code>❯ Funciones de utilidad usadas en toda la aplicación frontend.</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>components</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/student-create-form.jsx'>student-create-form.jsx</a></b></td>
								<td><code>❯ Componente de formulario para crear nuevos perfiles de estudiantes.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/theme-provider.jsx'>theme-provider.jsx</a></b></td>
								<td><code>❯ Componente que proporciona contexto y configuración de temas.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/file-upload-demo.jsx'>file-upload-demo.jsx</a></b></td>
								<td><code>❯ Componente de demostración que muestra la funcionalidad de carga de archivos.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/card-carrousell.jsx'>card-carrousell.jsx</a></b></td>
								<td><code>❯ Componente de carrusel para mostrar tarjetas en una vista deslizante.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/school-create-form.jsx'>school-create-form.jsx</a></b></td>
								<td><code>❯ Componente de formulario para crear un nuevo perfil de escuela.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/complete-profile-form.jsx'>complete-profile-form.jsx</a></b></td>
								<td><code>❯ Componente de formulario para completar detalles del perfil de usuario.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/signup-form-demo.jsx'>signup-form-demo.jsx</a></b></td>
								<td><code>❯ Componente de demostración para la funcionalidad de registro de usuarios.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/classroom-create-form.jsx'>classroom-create-form.jsx</a></b></td>
								<td><code>❯ Componente de formulario para crear una nueva aula.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/aurora-background-demo.jsx'>aurora-background-demo.jsx</a></b></td>
								<td><code>❯ Componente de demostración que muestra un fondo animado de aurora.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/profile-edit-form.jsx'>profile-edit-form.jsx</a></b></td>
								<td><code>❯ Componente de formulario para editar información del perfil de usuario.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/signin-form-demo.jsx'>signin-form-demo.jsx</a></b></td>
								<td><code>❯ Componente de demostración para la funcionalidad de inicio de sesión de usuarios.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/sidebar-demo.jsx'>sidebar-demo.jsx</a></b></td>
								<td><code>❯ Componente de demostración que muestra una interfaz de navegación de barra lateral.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/classroom-edit-form.jsx'>classroom-edit-form.jsx</a></b></td>
								<td><code>❯ Componente de formulario para editar detalles del aula.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/macbook-scroll.jsx'>macbook-scroll.jsx</a></b></td>
								<td><code>❯ Componente que simula un efecto de desplazamiento de MacBook.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/theme-switch.jsx'>theme-switch.jsx</a></b></td>
								<td><code>❯ Componente de alternancia para cambiar entre temas (por ejemplo, modo claro/oscuro).</code></td>
							</tr>
							</table>
							<details>
								<summary><b>ui</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/ui/label.jsx'>label.jsx</a></b></td>
										<td><code>❯ Componente UI para mostrar etiquetas de formulario o texto.</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/ui/modal.js'>modal.js</a></b></td>
										<td><code>❯ Componente UI para diálogos modales.</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/ui/sidebar.jsx'>sidebar.jsx</a></b></td>
										<td><code>❯ Componente UI reutilizable de barra lateral.</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/ui/input.jsx'>input.jsx</a></b></td>
										<td><code>❯ Componente UI de campo de entrada.</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/ui/apple-cards-carousel.jsx'>apple-cards-carousel.jsx</a></b></td>
										<td><code>❯ Componente de carrusel con un diseño inspirado en Apple.</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/ui/macbook-scroll.jsx'>macbook-scroll.jsx</a></b></td>
										<td><code>❯ Versión UI alternativa del efecto de desplazamiento de MacBook.</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/components/ui/file-upload.jsx'>file-upload.jsx</a></b></td>
										<td><code>❯ Componente UI para manejar cargas de archivos.</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>app</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/app/layout.js'>layout.js</a></b></td>
								<td><code>❯ Componente de diseño raíz que define la estructura general de la página.</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/app/page.js'>page.js</a></b></td>
								<td><code>❯ Componente principal de la página de inicio de la aplicación.</code></td>
							</tr>
							<details>
								<summary><b>schools</b></summary>
								<blockquote>
									<details>
										<summary><b>new</b></summary>
										<blockquote>
											<table>
											<tr>
												<td><b><a href='https://github.com/MAESTRE-TFG/maestre.git/blob/master/frontend/src/app/schools/new/page.js'>page.js</a></b></td>
												<td><code>❯ Componente de página para crear una nueva entrada de escuela.</code></td>
											</tr>
											</table>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
				</blockquote>
			</details>
		</blockquote>
	</details>
</details>



---

##  Despliegue local


###  Requisitos previos

Antes de comenzar con FISIOFIND, asegúrate de que tu entorno de ejecución cumpla con los siguientes requisitos:

- **Lenguaje de programación:** [Python](https://www.python.org/)
- **Gestor de paquetes:** [Npm](https://www.npmjs.com/), [Pip](https://pypi.org/project/pip/)
- **Base de datos:** [PostgreSQL](https://www.postgresql.org/)
- **LLM:** [Ollama](https://ollama.com/) -> [llama3.2-3b](https://ollama.com/library/llama3.2) y [deepseek-r1](https://ollama.com/library/deepseek-r1)


###  Instalación

Instala FISIOFIND utilizando uno de los siguientes métodos:

**Construir desde la fuente:**

1. Clona el repositorio FISIOFIND:
```sh
❯ git clone https://github.com/MAESTRE-TFG/maestre
```

2. Navega al directorio del proyecto:
```sh
❯ cd maestre
```

3. Instala las dependencias del proyecto:

**Usando `pip`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Pip-3776AB.svg?style={badge_style}&logo=pypi&logoColor=white" />](https://pypi.org/project/pip/)

Primero, crea y activa un entorno virtual de Python en el directorio backend:

```sh
❯ cd backend
❯ python -m venv venv
❯ source venv/bin/activate
```
Luego procedemos a instalar las dependencias:

```sh
❯ pip install -r requirements.txt
```
**Usando `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" />](https://www.npmjs.com/)

Ahora instalamos las dependencias del framework frontend en el directorio `frontend`:

```sh
❯ cd ../fronend
❯ npm install
```

###  Uso

La primera vez que se despliega el proyecto localmente, necesitamos crear un archivo .env en el directorio `backend` de acuerdo con el archivo `.env.example`.

Para ejecutar el servidor backend, sigue estos pasos en el directorio `backend` **y con el venv activado**:

```sh
❯ cd .\backend
❯ python .\manage.py makemigrations
❯ python .\manage.py migrate
❯ python .\manage.py runserver
```
Adicionalmente, la primera vez que se despliega el proyecto localmente, necesitamos crear un superusuario para acceder al panel de administración:

```sh
❯ python.\manage.py createsuperuser
```

Después de que el servidor backend local esté en funcionamiento, podemos ejecutar el servidor frontend **en una nueva ventana de terminal**:

**Usando `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ cd ../../fronted
❯ npm run dev
```

###  Pruebas
Ejecuta el conjunto de pruebas utilizando el siguiente comando:

**Usando `pip`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Pip-3776AB.svg?style={badge_style}&logo=pypi&logoColor=white" />](https://pypi.org/project/pip/)

```sh
❯ run manage.py test
```

O elige un módulo específico para probar usando:

```sh
❯ run manage.py test [módulo]
```

Para un estudio detallado de cobertura:

```sh
❯ coverage run manage.py test [módulo]
❯ coverage report
❯ coverage html
```


---
##  Hoja de ruta del proyecto

**Sprint 1**
- [X] **`Tarea 1.1`**: Gestión de usuarios - registro/inicio de sesión/cierre de sesión/edición
- [X] **`Tarea 1.2`**: Funcionalidad de aulas
- [X] **`Tarea 1.3`**: Gestión de estudiantes
- [X] **`Tarea 1.4`**: Interfaz base - Inicio
- [X] **`Tarea 1.5`**: Primeras pruebas unitarias

**Sprint 2**
- [X] **`Tarea 2.1`**: Gestión de materiales (replanificado desde Sprint 1)
- [X] **`Tarea 2.2`**: **Herramienta de generación de exámenes**
- [X] **`Tarea 2.3`**: Interfaz estilizada
- [X] **`Tarea 2.4`**: Conjunto completo de pruebas unitarias (replanificado desde Sprint 1)

**Sprint 3**

- [X] **`Tarea 3.1`**: Gestión de errores (replanificado desde Sprint 2)
- [X] **`Tarea 3.2`**: Gestión de políticas y términos de usuario
- [X] **`Tarea 3.3`**: **Herramienta de planificación**
- [X] **`Tarea 3.4`**: Pruebas y mejoras de la herramienta de generación de exámenes

**Sprint 4**

- [X] **`Tarea 4.1`**: Herramienta de traducción
- [X] **`Tarea 4.2`**: Herramienta de planificación
- [X] **`Tarea 4.3`**: Informe final de pruebas

---

##  Contribuir

- **🐛 [Reportar problemas](https://github.com/MAESTRE-TFG/maestre/issues)**: Envía los errores encontrados o registra solicitudes de funciones para el proyecto `maestre.git`.

- **💡 [Enviar solicitudes de extracción](https://github.com/MAESTRE-TFG/maestre/blob/main/CONTRIBUTING.md)**: Revisa las solicitudes de extracción abiertas y envía las tuyas propias.

<details closed>
<summary>Directrices para contribuir</summary>


1. **Haz un fork del repositorio**: Comienza haciendo un fork del repositorio del proyecto a tu cuenta de github.

2. **Clona localmente**: Clona el repositorio bifurcado a tu máquina local usando un cliente git.
   ```sh
   git clone https://github.com/MAESTRE-TFG/maestre
   ```

3. **Crea una nueva rama**: Trabaja siempre en una nueva rama, dándole un nombre descriptivo.
   ```sh
   git checkout -b feat/nueva-funcionalidad-x
   ```

4. **Realiza tus cambios**: Desarrolla y *prueba* tus cambios localmente.

5. **Confirma tus cambios**: Confirma con un mensaje claro que describa tus actualizaciones siguiendo los estándares de *commits convencionales* y tratando de hacerlos lo más *atómicos* posible.
   ```sh
   git commit -m 'Feat: Implementada nueva funcionalidad x.'
   ```

6. **Sube a github**: Sube los cambios a tu repositorio bifurcado.
   ```sh
   git push origin feat/nueva-funcionalidad-x
   ```

7. **Envía una solicitud de extracción**: Crea una PR contra el repositorio original del proyecto apuntando a la rama develop. **Describe claramente los cambios y sus motivaciones utilizando la plantilla proporcionada**.

8. **Revisión**: Una vez que se revise y apruebe tu PR, se fusionará con la rama principal. ¡Felicitaciones por tu contribución!
</details>

<details closed>
	<summary>Gráfico de contribuyentes</summary>
	<br>
	<p align="left"> <a href="https://github.com/MAESTRE-TFG/maestre/graphs/contributors">
	<img src="https://contrib.rocks/image?repo=MAESTRE-TFG/maestre"> </a> </p>
</details>

---

##  Licencia

Este proyecto está protegido bajo la licencia [MIT License](https://choosealicense.com/licenses/mit/). Para más detalles, consulta el archivo [LICENSE](LICENSE).

---

##  Agradecimientos

Antonio Macías y Rafael Pulido, los dos creadores de este proyecto:

<table>
	<td align="center">
		<a href="https://github.com/antoniommff">
			<img src="https://avatars.githubusercontent.com/u/91947070?v=4" width="100px;" alt="Antonio Macías"/>
			<br />
					<sub><b>Antonio Macías</b></sub>
			<sub><b>Director de proyecto, Desarrollador Analista, Ingeniero de Software</b></sub>
		</a>
	</td>
	<td align="center">
		<a href="https://github.com/rafpulcif">
			<img src="https://avatars.githubusercontent.com/u/91948036?v=4" width="100px;" alt="Rafael Pulido"/>
			<br />
			<sub><b>Rafael Pulido</b></sub>
			<sub><b>Desarrollador Analista, Ingeniero de Software</b></sub>
		</a>
	</td>
</table>

---
