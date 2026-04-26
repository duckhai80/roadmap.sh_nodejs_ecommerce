-- Create table
create table test_table (
  id int not null,
  name varchar(50) default null,
  age int default null,
  address varchar(50) default null,

  primary key (id)
) engine=InnoDB default charset=utf8mb4;

-- Create procedure
create definer=`duckhai80`@`%` procedure `insert_data`()
begin
  declare max_id int default 1000000;
  declare i int default 1;

  while i<=max_id do
    insert into test_table (id, name, age, address)
    values (i, concat('Name', i), i%100, concat('Address', i));
    set i=i+1;
  end while;  
end

call insert_data();