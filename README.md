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
git clone https://github.com/yourusername/powerlink-js-api-wrapper.git

# Navigate to the cloned directory
cd powerlink-js-api-wrapper
```

## Usage

Basic usage instructions, like how to import and use the class:

```
import Fireberry from './path/to/Fireberry';
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

### Objects()

<table>
    <thead>
        <tr>
            <th>Function </th>
            <th>Options</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>()</code></td>
            <td>None</td>
            <td>Returns all object types available.</td>
        </tr>
        <tr>
            <td><code>create</code></td>
            <td><code>name</code>: string, <code>collectionname</code>: string</td>
            <td>Creates a new object type with the specified name and collection name.</td>
        </tr>
        <tr>
            <td><code>update</code></td>
            <td><code>objecttype</code>: Type, <code>newData</code>: object</td>
            <td>Updates an existing object type identified by the <code>objecttype</code> with the provided new data.</td>
        </tr>
        <tr>
            <td><code>delete</code></td>
            <td><code>objecttype</code>: Type</td>
            <td>Deletes the specified object type.</td>
        </tr>
    </tbody>
</table>

### Object (objectid: string)

<table>
    <thead>
        <tr>
            <th>Function </th>
            <th>Options</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
    <tr>  <td><code>create</code></td>  <td><code>data</code>: object</td>  <td>Creates a new record within the specified object type.</td>  </tr>  <tr>  <td><code>getAll</code></td>  <td>None</td>  <td>Retrieves all records from the specified object type.</td>  </tr>  <tr>  <td><code>get</code></td>  <td><code>objectid</code>: string</td>  <td>Retrieves a specific record by its ID from the specified object type.</td>  </tr>  <tr>  <td><code>update</code></td>  <td><code>objectid</code>: string, <code>newData</code>: object</td>  <td>Updates a specific record identified by its ID within the specified object type.</td>  </tr>  <tr>  <td><code>delete</code></td>  <td><code>objectid</code>: string</td>  <td>Deletes a specific record identified by its ID from the specified object type.</td>  </tr>  <tr>  <td><code>query</code></td>  <td><code>query</code>, <code>page_number</code>, <code>page_size</code>, <code>sort_type</code>, <code>sort_by</code></td>  <td>Performs a query on the specified object type with filtering, sorting, and pagination options.</td>  </tr>  <tr>  <td><code>queryOne</code></td>  <td><code>query</code>, <code>sort_type</code>, <code>sort_by</code></td>  <td>Fetches the first record based on the specified query and sorting criteria from the specified object type.</td>  </tr>
    </tbody>
    </table>

### Fields()

<table>
    <thead>
        <tr>
            <th>Function </th>
            <th>Options</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
    <tr>  <td><code>()</code></td> <td>None</td> <td>Returns all fields available within the object.</td>  </tr>  <tr>  <td><code>create</code></td>  <td><code>fieldType</code>: string, <code>data</code>: object</td>  <td>Creates a new field of the specified type and data within the current object type.</td>  </tr>
    </tbody>
    </table>

### Field (fieldid: string)

<table>
    <thead>
        <tr>
            <th>Function </th>
            <th>Options</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>get</code></td>
            <td>None</td>
            <td>Retrieves details for a specific field within the given object type, identified by <code>fieldname</code>.</td>
        </tr>
        <tr>
            <td><code>update <strong>(to be implemented)</strong></code></td>
            <td>---</td>
            <td>Updates the specific field within the given object type.</td>
        </tr>
        <tr>
            <td><code>delete</code></td>
            <td>None</td>
            <td>Deletes the specific field within the given object type, identified by <code>fieldname</code>.</td>
        </tr>
        <tr>
            <td><code>values</code></td>
            <td>None</td>
            <td>Retrieves the values for a specific field within the given object type, identified by <code>fieldname</code>.</td>
        </tr>
    </tbody>
</table>

### Views()

<table>
    <thead>
        <tr>
            <th>Function</th>
            <th>Options</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>()</code></td>
            <td>None</td>
            <td>Returns all views available within the object type.</td>
        </tr>
        <tr>
            <td><code>create</code></td>
            <td><code>name</code>: string</td>
            <td>Creates a new view with the specified name for the current object type.</td>
        </tr>
    </tbody>
</table>

### View (viewid: string)

<table>
    <thead>
        <tr>
            <th>Function</th>
            <th>Options</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>get</code></td>
            <td>None</td>
            <td>Retrieves details of the specific view identified by <code>viewid</code> within the current object type.</td>
        </tr>
        <tr>
            <td><code>update</code></td>
            <td><code>data</code>: object</td>
            <td>Updates the specific view identified by <code>viewid</code> with the provided data.</td>
        </tr>
        <tr>
            <td><code>delete</code></td>
            <td>None</td>
            <td>Deletes the specific view identified by <code>viewid</code> from the current object type.</td>
        </tr>
        <tr>
            <td><code>duplicate</code></td>
            <td>None</td>
            <td>Duplicates the specific view identified by <code>viewid</code> for the current object type.</td>
        </tr>
        <tr>
            <td><code>setFavorite</code></td>
            <td>None</td>
            <td>Sets the specific view identified by <code>viewid</code> as a favorite for the current object type.</td>
        </tr>
        <tr>
            <td><code>removeFavorite</code></td>
            <td>None</td>
            <td>Removes the specific view identified by <code>viewid</code> from favorites for the current object type.</td>
        </tr>
    </tbody>
</table>

## Contributing

Contributions to the Powerlink JavaScript API Wrapper are welcome. Feel free to fork the repository and submit pull requests.

## License

This project is licensed under the MIT License

<a href="https://www.buymeacoffee.com/idanshr" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-1.svg" alt="buy me a coffee" width="200px"/></a>
