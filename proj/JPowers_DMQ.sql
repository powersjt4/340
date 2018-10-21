/*
Jacob Powers
DMQ For Project
10/21/18
*/


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
SELECT name, price, description, item_meal, primary_ingredient from items

SELECT id from items where :item_id_is_equal_to_name_in_drop_down

INSERT INTO menu_items (mid, iid) VALUES (:menu_id_from_dropdown, :item_id_from_dropdown)

/*Display a Selected Menu*/
--Propogate menu select dropdown
SELECT name FROM menu

--Selects menu id from menu name
SELECT id FROM menu WHERE :menu_id_is_equal_to_name_in_drop_down

-- Get items from selected menu
SELECT name, price, description
FROM items INNER JOIN menu_items ON  menu.id= mid
INNER JOIN items ON items.id = iid
