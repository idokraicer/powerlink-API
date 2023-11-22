# Powerlink JavaScript API Wrapper

This repository contains a JavaScript class designed for seamless interaction with the Powerlink CRM API. It simplifies CRUD operations and data querying, providing a more intuitive way for developers to integrate CRM functionalities into JavaScript-based applications.

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Features](#features)
-   [Function Reference](#function-reference)
-   [Contributing](#contributing)
-   [License](#license)

## Installation

Instructions on how to integrate this JavaScript class into a project:

```
# Clone this repository
git clone https://github.com/IdanSHR/powerlink-API.git

# Navigate to the cloned directory
cd powerlink-js-api-wrapper
```

## Usage

Basic usage instructions, like how to import and use the class:

```
import Fireberry from './path/to/fireberry';
```

or

```
<script src="fireberry.js></script>
```

<b>Example usages</b>

```
const apiToken = 'YOUR_API_TOKEN';
const fb = new Fireberry(apiToken);

//Get all customers
fb.object(Type.CUSTOMER).getAll();

//Get account by ID
fb.object(Type.ACCOUNT).getById("xxxx-xxxxx-xxxxx-xxxx");

//Create new task
fb.object(Type.TASK).create({ subject: "New Task" });

//Delete customer object 1004 record
fb.object(1004).delete("xxxx-xxxxx-xxxxx-xxxx");
```

## Features

-   Simplified CRUD operations with Powerlink CRM objects.
-   Streamlined query and data retrieval processes.
-   Efficient API token management and request header handling.

## Function Reference

<table><thead><tr><th>Function</th><th>Options</th><th>Description</th></tr></thead><tbody><tr><td><code>create</code></td><td><code>data</code>: object</td><td>Creates a new record in the specified object.</td></tr><tr><td><code>getById</code></td><td><code>objectid</code>: string</td><td>Retrieves a record by its ID.</td></tr><tr><td><code>query</code></td><td><code>query</code>, <code>page_number</code>, <code>page_size</code>, <code>sort_type</code>, <code>sort_by</code></td><td>Queries records from the specified object.</td></tr><tr><td><code>queryOne</code></td><td><code>query</code>, <code>sort_type</code>, <code>sort_by</code></td><td>Retrieves the first record based on the query.</td></tr><tr><td><code>getAll</code></td><td><code>query</code>: string</td><td>Retrieves all records from the specified object.</td></tr><tr><td><code>update</code></td><td><code>objectid</code>: string, <code>newData</code>: object</td><td>Updates a record by its ID.</td></tr><tr><td><code>delete</code></td><td><code>objectid</code>: string</td><td>Deletes a record by its ID.</td></tr><tr><td><code>object</code></td><td><code>Type</code>: enum value</td><td>Returns an object with CRUD and query methods.</td></tr></tbody></table>

## Contributing

Contributions to the Powerlink JavaScript API Wrapper are welcome. Feel free to fork the repository and submit pull requests.

## License

This project is licensed under the MIT License
