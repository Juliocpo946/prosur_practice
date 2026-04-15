------- Categorias -----------

-- get todas activas
select * from categories where active = 1;

-- busqueda por id
select * from categories where id = 1;

-- insertar
insert into categories (name) values ('Bebidas');

-- actualizar
update categories set name = 'Postres' where id = 2;

-- borrado logico
update categories set active = 0 where id = 3;



------- Productos -----------
-- get con categoria
select p.*, c.name as category_name
from products p
join categories c on p.category_id = c.id
where p.active = 1 and c.active = 1;

-- get por id
select p.*, c.name as category_name
from products p
join categories c on p.category_id = c.id
where p.id = 5;

-- Insertar
insert into products (category_id, name, price, stock)
values (1, 'Cafe con leche', 35.00, 100);

-- actuzalizar
update products set category_id = 2, name = 'Cafe negro', price = 45.00, stock = 80
where id = 5;

-- borrado logico
update products set active = 0 where id = 5;

-- restar al stock
update products set stock = stock - 2 where id = 5 and stock >= 2;



----- Ventas ------

--insertar
insert into sales (total) values (120.00);

-- insertar productos a la venta
insert into sale_items (sale_id, product_id, quantity, unit_price)
values (10, 5, 2, 35.00);