<p align="center">
    <img src="frontend/static/logos/maestre_logo_circle_black.png" align="center" width="30%">
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
<p align="center"><!-- default option, no dependency badges. -->
</p>
<p align="center">
	<!-- default option, no dependency badges. -->
</p>
<br>

##  Table of Contents

- [Table of Contents](#table-of-contents)
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

---

##  Overview

*MAESTRE is a cutting-edge web application leveraging artificial intelligence to enhance the workplace experience for secondary and high school teachers. By streamlining administrative tasks and providing data-driven insights, it empowers educators to focus on what matters most—teaching.*

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
    ├── .github
    │   ├── ISSUE_TEMPLATE
    │   └── PULL_REQUEST_TEMPLATE.md
    ├── backend
    │   ├── api
    │   ├── backend
    │   ├── classrooms
    │   ├── materials
    │   ├── schools
    │   ├── students
    │   └── users
    └── frontend
    	├── public
    	├── src
    	└── static
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
				<summary><b>users</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Contains the Django app/module handling user models, authentication, and related views.</code></td>
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
				<summary><b>schools</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Contains the Django app/module handling school-related models, views, and functionality.</code></td>
					</tr>
					</table>
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
**Using `npm`** &nbsp; [<img align="center" src="" />]()

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

**Using `npm`** &nbsp; [<img align="center" src="" />]()

```sh
❯ cd ../../fronted
❯ npm run dev
```

###  Testing
Run the test suite using the following command:

**Using `pip`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Pip-3776AB.svg?style={badge_style}&logo=pypi&logoColor=white" />](https://pypi.org/project/pip/)

```sh
❯ pytest
```

Or choose an specific module to test using:

```sh
❯ pytest classroom
```

For a detailed coverage study:

```sh
❯ pytest
❯ pytest --cov=backend
❯ pytest --cov=backend --cov-report=html
```


---
##  Project Roadmap

**Sprint 1**
- [X] **`Task 1`**: <strike>Mock-ups</strike>
- [X] **`Task 2`**: User registration
- [X] **`Task 3`**: Data modeling
- [X] **`Task 4`**: CRUD for content

**Sprint 2**
- [X] **`Task 1`**: Manage materials and students (replanned from Sprint 1)
- [X] **`Task 2`**: Implement unit tests
- [X] **`Task 3`**: Modify the homepage styles
- [ ] **`Task 4`**: Error management
- [X] **`Task 5`**: Exam generation
- [X] **`Task 5`**: Research on AI APIs

**Sprint 3**

- [ ] **`Task 1`**: TODO
- [ ] ...

**Sprint 4**

- [ ] **`Task 1`**: TODO.
- [ ] ...

---

##  Contributing

- **💬 [Join the Discussions](https://github.com/MAESTRE-TFG/maestre/discussions)**: Share your insights, provide feedback, or ask questions.
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

4. **Make Your Changes**: Develop and test your changes locally.

5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Feat: Implemented new feature x.'
   ```

6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin feat/new-feature-x
   ```

7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.

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
