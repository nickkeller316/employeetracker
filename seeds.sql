  
DROP DATABASE IF EXISTS businessDB;

CREATE DATABASE businessDB;

USE businessDB;

CREATE TABLE department (
  id INT AUTO_INCREMENT NOT NULL,
  department_name varchar(30) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT NOT NULL,
  title varchar(30) NOT NULL,
  salary DECIMAL(10,2) NULL,
  department_id INT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employees (
  id INT AUTO_INCREMENT NOT NULL,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL, 
  role_id INT NULL,
  manager_id INT NULL DEFAULT false,
  PRIMARY KEY(id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- Inserted a set of records into the table
INSERT INTO department (department_name)
VALUES ("Web Development"),("HR"),("Financials"),("R&D"),("Training"),("Accounting");

INSERT INTO roles (title, salary, department_id)
VALUES ("Nodejs Developer", 80000.00, 1),("Receptionist", 60000.00, 2),("Book Guy", 120000.00, 3),
("Research Specialist", 110000.00, 4),("Intern Manager", 90000.00, 5),("Cost Analyist", 130000.00, 6);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Nick", "Keller", 1, null),("Jason", "Aristides", 2, 2),("Chase", "Culp", 3, 1),("Ramsey", "Hayek", 4, 3),("Henry", "Leigh", 5, 3),
("Josh", "Pagel", 6, null),("Kai", "Chamberlain", 1, 1),("Jacob", "Rowlen", 4, null),("Shea", "Carstens", 2, 4);
