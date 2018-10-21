-- These are some Database Manipulation queries for a partially implemented Project Website 
-- using the bsg database.
-- Your submission should contain ALL the queries required to implement ALL the
-- functionalities listed in the Project Specs.


/*Add to Items Page*/
-- Propogate item table diplay
SELECT name, price, description. item_meal, primary_ingredient FROM items

-- add an item 
INSERT INTO items (name, price, description) VALUES (:name_frm, :price_frm, :desc_frm, :item_meal_frm)
INSERT INTO meal (name) VALUES (:item_meal) 
INSERT INTO primary_ingredient(name) VALUES (:primary_ingredient)

-- delete a item
DELETE FROM items WHERE id = :item_ID_selected_from_item_table
DELETE FROM meal WHERE id = :meal_ID_selected_deleted_item
DELETE FROM primary_ingredient WHERE id = :primary_ingredient_selected_deleted_item

/*Add to Menu Page*/
-- Propogate menu table diplay
SELECT name, restaurant_name, type FROM menu

INSERT INTO menu (name, meal_type) VALUES (:menu_name_frm) 

DELETE FROM menu WHERE id = :menu_ID_selected_deleted_menu

/*Add to Add Items to Menu Page*/

--Propogate menu select dropdown
SELECT name FROM menu 

--Selects menu id from  menu name
SELECT id FROM menu WHERE :menu_id_is_equal_to_name_in_drop_down

--Propogate items table
SELECT name, price, description. item_meal, primary_ingredient from items

SELECT id from items where :item_id_is_equal_to_name_in_drop_down

INSERT INTO menu_items (mid, iid) VALUES (:menu_id_from_dropdown, :item_id_from_dropdown)

/*Add to Display a Selected Menu*/

--Propogate menu select dropdown
SELECT name FROM menu 

--Selects menu id from menu name
SELECT id FROM menu WHERE :menu_id_is_equal_to_name_in_drop_down

-- Get items from selected menu
SELECT mid, iid 
FROM menu 
INNER JOIN bsg_cert_people ON bsg_people.character_id = bsg_cert_people.pid 
INNER JOIN bsg_cert on bsg_cert.certification_id = bsg_cert_people.cid 
ORDER BY name, certificate






-- get all characters and their homeworld name for the List People page
SELECT bsg_people.character_id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people 
INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id

-- get a single character's data for the Update People form
SELECT character_id, fname, lname, homeworld, age FROM bsg_people WHERE character_id = :character_ID_selected_from_browse_character_page

-- get all character's data to populate a dropdown for associating with a certificate  
SELECT character_id AS pid, fname, lname FROm bsg_people 




-- get all certificates to populate a dropdown for associating with people
SELECT certification_id AS cid, title FROM bsg_cert

-- get all peoople with their current associated certificates to list
SELECT pid, cid, CONCAT(fname,' ',lname) AS name, title AS certificate 
FROM bsg_people 
INNER JOIN bsg_cert_people ON bsg_people.character_id = bsg_cert_people.pid 
INNER JOIN bsg_cert on bsg_cert.certification_id = bsg_cert_people.cid 
ORDER BY name, certificate

-- add a new character
INSERT INTO bsg_people (fname, lname, homeworld, age) VALUES (:fnameInput, :lnameInput, :homeworld_id_from_dropdown_Input, :ageInput)

-- associate a character with a certificate (M-to-M relationship addition)
INSERT INTO bsg_cert_people (pid, cid) VALUES (:character_id_from_dropdown_Input, :certification_id_from_dropdown_Input)

-- update a character's data based on submission of the Update Character form 
UPDATE bsg_people SET fname = :fnameInput, lname= :lnameInput, homeworld = :homeworld_id_from_dropdown_Input, age= :ageInput WHERE id= :character_ID_from_the_update_form



-- dis-associate a certificate from a person (M-to-M relationship deletion)
DELETE FROM bsg_cert_people WHERE pid = :character_ID_selected_from_certificate_and_character_list AND cid = :certification_ID_selected_from-certificate_and_character_list
-- delete a character
DELETE FROM bsg_people WHERE id = :character_ID_selected_from_browse_character_page