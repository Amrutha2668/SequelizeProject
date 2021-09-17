# Instructions to open the project.

1. Copy the repository link.
2. Open visual studio code.
3. Using clone "repo-link" command clone the repository.

## Project dependencies

1. CSV file path in loader class.
2. Download any state's csv file using the below link.
   https://data.gov.in/catalog/company-master-data?filters%5Bfield_catalog_reference%5D=354261&format=json&offset=0&limit=6&sort%5Bcreated%5D=desc
3. Mysql User-Name and Password in the database.js which is inside database folder.

## About Project
* Run main.js which is inside js folder.
### Loader class

1. Reads data from csv file.
2. Creates DataBase if not exists in mysql Server.
3. Creates DataTable.
4. Stores the read data into created table.

### Analyzer class

1. Fetches data from database which is in mysql server.
2. Executes the query as per required solution.
3. Stores that fetched result to a Object.
4. Object is converted as an json file at the end.
