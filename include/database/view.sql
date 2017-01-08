/****************************************************/
/* user session										*/
/****************************************************/
CREATE VIEW vw_user_session 
AS
SELECT 
b.*,
a.session_id, a.ip_address, a.platform, a.browser, a.version
FROM public_user_session a 
INNER JOIN public_user b ON (a.user_id = b.id)
WHERE 
a.deleted <> 1 AND a.status = 1 AND
b.deleted <> 1 AND b.status = 1;


/****************************************************/
/* admin session									*/
/****************************************************/
CREATE VIEW vw_admin_session 
AS
SELECT 
b.*,
a.session_id, a.ip_address, a.platform, a.browser, a.version
FROM website_admin_session a 
INNER JOIN website_admin b ON (a.admin_id = b.id)
WHERE 
a.deleted <> 1 AND a.status = 1 AND
b.deleted <> 1 AND b.status = 1;


/****************************************************/
/* public menu structure : combine menu and template */
/****************************************************/
CREATE VIEW vw_public_menu_struct
AS
	SELECT DISTINCT
	1 as nodes, 
	e.id AS menu_id, e.parent_id AS parent_id, 
	e.menu_key AS menu_key,
	e.title_en AS menu_name_en, e.title_cn AS menu_name_cn, 
	e.desc_en AS menu_desc_en, e.desc_cn AS menu_desc_cn,
	e.url, e.template, e.orderno, e.created_time 

	FROM public_menu e 
	WHERE e.deleted <> 1 AND e.status = 1  
UNION ALL
	SELECT DISTINCT
	0 as nodes,
	e.id AS temp_id, e.ref_id AS parent_id,  
	e.menu_key AS menu_key, 
	e.title_en AS temp_name_en, e.title_cn AS temp_name_cn, 
	e.desc_en AS temp_desc_en, e.desc_cn AS temp_desc_cn,
	e.url, e.template, e.orderno, e.created_time 
	FROM public_template e 
	WHERE e.deleted <> 1 AND e.status = 1 
	ORDER BY menu_id,  orderno DESC, created_time; 



/****************************************************/
/* user menu structure : combine menu and template */
/****************************************************/
CREATE VIEW vw_user_menu 
AS 
	SELECT DISTINCT
	s.session_id AS session_id,
	1 as nodes, 
	a.id AS user_id, 

	d.right_id,
	e.id AS menu_id, e.parent_id AS parent_id, 
	e.menu_key AS menu_key,
	e.title_en AS menu_name_en, e.title_cn AS menu_name_cn, 
	e.desc_en AS menu_desc_en, e.desc_cn AS menu_desc_cn,
	e.url, e.template, e.orderno, e.created_time 
	FROM public_user_session s 
	INNER JOIN public_user a ON (s.user_id = a.id)
	INNER JOIN user_group c ON (a.group_id = c.id)
	INNER JOIN user_group_menu d ON (c.id = d.group_id) 
	INNER JOIN user_menu e ON  (d.menu_id = e.id)
	WHERE 
	s.deleted <> 1 AND s.status = 1 AND
	a.deleted <> 1 AND a.status =1  AND
	c.deleted <> 1 AND c.status = 1 AND
	e.deleted <> 1 AND e.status = 1 AND 
	e.parent_id = 0 AND
	right_id = 'view';

CREATE VIEW vw_user_template 
AS 
	SELECT DISTINCT
	s.session_id AS session_id,
	0 as nodes,
	a.id AS user_id, 
	d.right_id,
	e.id AS temp_id, e.ref_id AS parent_id,  
	e.menu_key AS menu_key, 
	e.title_en AS temp_name_en, e.title_cn AS temp_name_cn, 
	e.desc_en AS temp_desc_en, e.desc_cn AS temp_desc_cn,
	e.url, e.template, e.orderno, e.created_time 
	FROM public_user_session s 
	INNER JOIN public_user a ON (s.user_id = a.id)
	INNER JOIN user_group c ON (a.group_id = c.id)
	INNER JOIN user_group_template d ON (c.id = d.group_id) 
	INNER JOIN user_template e ON  (d.temp_id = e.id)
	WHERE 
	s.deleted <> 1 AND s.status = 1 AND
	a.deleted <> 1 AND a.status =1  AND
	c.deleted <> 1 AND c.status = 1 AND
	e.deleted <> 1 AND e.status = 1 AND 
	right_id = 'view' 
	ORDER BY user_id, orderno DESC, created_time; 




CREATE VIEW vw_user_menu_struct
AS
	SELECT DISTINCT
	s.session_id AS session_id,
	1 as nodes, 
	a.id AS user_id, 

	d.right_id,
	e.id AS menu_id, e.parent_id AS parent_id, 
	e.menu_key AS menu_key,
	e.title_en AS menu_name_en, e.title_cn AS menu_name_cn, 
	e.desc_en AS menu_desc_en, e.desc_cn AS menu_desc_cn,
	e.url, e.template, e.orderno, e.created_time 
	FROM public_user_session s 
	INNER JOIN public_user a ON (s.user_id = a.id)
	INNER JOIN user_group c ON (a.group_id = c.id)
	INNER JOIN user_group_menu d ON (c.id = d.group_id) 
	INNER JOIN user_menu e ON  (d.menu_id = e.id)
	WHERE 
	s.deleted <> 1 AND s.status = 1 AND
	a.deleted <> 1 AND a.status =1  AND
	c.deleted <> 1 AND c.status = 1 AND
	e.deleted <> 1 AND e.status = 1 AND 
	right_id = 'view' 
UNION ALL
	SELECT DISTINCT
	s.session_id AS session_id,
	0 as nodes,
	a.id AS user_id, 

	d.right_id,
	e.id AS temp_id, e.ref_id AS parent_id,  
	e.menu_key AS menu_key, 
	e.title_en AS temp_name_en, e.title_cn AS temp_name_cn, 
	e.desc_en AS temp_desc_en, e.desc_cn AS temp_desc_cn,
	e.url, e.template, e.orderno, e.created_time 
	FROM public_user_session s 
	INNER JOIN public_user a ON (s.user_id = a.id)
	INNER JOIN user_group c ON (a.group_id = c.id)
	INNER JOIN user_group_template d ON (c.id = d.group_id) 
	INNER JOIN user_template e ON  (d.temp_id = e.id)
	WHERE 
	s.deleted <> 1 AND s.status = 1 AND
	a.deleted <> 1 AND a.status =1  AND
	c.deleted <> 1 AND c.status = 1 AND
	e.deleted <> 1 AND e.status = 1 AND 
	right_id = 'view' 

	ORDER BY user_id, menu_id,  orderno DESC, created_time; 



/****************************************************/
/* admin menu structure : combine menu and template */
/****************************************************/
CREATE VIEW vw_admin_menu_struct
AS
	SELECT DISTINCT
	s.session_id AS session_id,
	1 as nodes, 
	a.id AS admin_id, 
	-- a.user_name, a.full_name,
	-- c.id as grp_id,  c.title_en as grp_name_en, c.title_cn as grp_name_cn,
	d.right_id,
	e.id AS menu_id, e.parent_id AS parent_id, 
	e.menu_key AS menu_key,
	e.title_en AS menu_name_en, e.title_cn AS menu_name_cn, 
	e.desc_en AS menu_desc_en, e.desc_cn AS menu_desc_cn,
	e.url, e.template, e.orderno, e.created_time 
	FROM website_admin_session s 
	INNER JOIN website_admin a ON (s.admin_id = a.id)
	INNER JOIN website_admin_group b ON (a.id = b.admin_id)
	INNER JOIN website_group c ON (b.group_id = c.id)
	INNER JOIN website_group_menu d ON (c.id = d.group_id) 
	INNER JOIN website_menu e ON  (d.menu_id = e.id)
	WHERE 
	s.deleted <> 1 AND s.status = 1 AND
	a.deleted <> 1 AND a.status =1  AND
	c.deleted <> 1 AND c.status = 1 AND
	e.deleted <> 1 AND e.status = 1 AND 
	right_id = 'view' 
UNION ALL
	SELECT DISTINCT
	s.session_id AS session_id,
	0 as nodes,
	a.id AS admin_id, 
	-- a.user_name, a.full_name,
	-- c.id as grp_id,  c.title_en as grp_name_en, c.title_cn as grp_name_cn,
	d.right_id,
	e.id AS temp_id, e.ref_id AS parent_id,  
	e.menu_key AS menu_key, 
	e.title_en AS temp_name_en, e.title_cn AS temp_name_cn, 
	e.desc_en AS temp_desc_en, e.desc_cn AS temp_desc_cn,
	e.url, e.template, e.orderno, e.created_time 
	FROM website_admin_session s 
	INNER JOIN website_admin a ON (s.admin_id = a.id)
	INNER JOIN website_admin_group b ON (a.id = b.admin_id)
	INNER JOIN website_group c ON (b.group_id = c.id)
	INNER JOIN website_group_template d ON (c.id = d.group_id) 
	INNER JOIN website_template e ON  (d.temp_id = e.id)
	WHERE 
	s.deleted <> 1 AND s.status = 1 AND
	a.deleted <> 1 AND a.status =1  AND
	c.deleted <> 1 AND c.status = 1 AND
	e.deleted <> 1 AND e.status = 1 AND 
	right_id = 'view' 

	ORDER BY admin_id, menu_id,  orderno DESC, created_time; 


 
/************************************************/
/* admin menu right : combine menu and template */
/************************************************/
CREATE VIEW vw_admin_right
AS
	SELECT DISTINCT
	s.session_id AS session_id,
	1 AS nodes,
	a.id AS admin_id, 
	d.right_id,
	
	e.id AS menu_id, e.parent_id AS parent_id,  
	e.menu_key AS menu_key, 
	e.title_en AS menu_name_en, e.title_cn AS menu_name_cn,
	e.desc_en AS menu_desc_en, e.desc_cn AS menu_desc_cn,
	
	e.url, e.template, e.orderno, e.created_time 
	
	FROM website_admin_session s 
	INNER JOIN website_admin a ON (s.admin_id = a.id)
	INNER JOIN website_admin_group b ON (a.id = b.admin_id)
	INNER JOIN website_group c ON (b.group_id = c.id)
	INNER JOIN website_group_menu d ON (c.id = d.group_id) 
	INNER JOIN website_menu e ON  (d.menu_id = e.id)
	WHERE 
	s.deleted <> 1 AND s.status = 1 AND
	a.deleted <> 1 AND a.status =1  AND
	c.deleted <> 1 AND c.status = 1 AND
	e.deleted <> 1 AND e.status = 1 
UNION ALL
	SELECT DISTINCT
	s.session_id AS session_id,
	0 AS nodes,
	a.id AS admin_id, 
	
	d.right_id,
	
	e.id AS temp_id, e.ref_id AS parent_id,  
	e.menu_key AS menu_key, 
	e.title_en AS temp_name_en, e.title_cn AS temp_name_cn,
	e.desc_en AS temp_desc_en, e.desc_cn AS temp_desc_cn,
	e.url, e.template, e.orderno, e.created_time 
	
	FROM website_admin_session s 
	INNER JOIN website_admin a ON (s.admin_id = a.id)
	INNER JOIN website_admin_group b ON (a.id = b.admin_id)
	INNER JOIN website_group c ON (b.group_id = c.id)
	INNER JOIN website_group_template d ON (c.id = d.group_id) 
	INNER JOIN website_template e ON  (d.temp_id = e.id)
	WHERE 
	s.deleted <> 1 AND s.status = 1 AND
	a.deleted <> 1 AND a.status =1  AND
	c.deleted <> 1 AND c.status = 1 AND
	e.deleted <> 1 AND e.status = 1 

	ORDER BY admin_id, menu_id,  orderno DESC, created_time;


/******************************************************/
/* user menu right : combine menu and template */
/******************************************************/
CREATE VIEW vw_user_right
AS
	SELECT DISTINCT
	s.session_id AS session_id,
	1 AS nodes,
	a.id AS user_id, 
	d.right_id,
	
	e.id AS menu_id, e.parent_id AS parent_id,  
	e.menu_key AS menu_key, 
	e.title_en AS menu_name_en, e.title_cn AS menu_name_cn,
	e.desc_en AS menu_desc_en, e.desc_cn AS menu_desc_cn,
	
	e.url, e.template, e.orderno, e.created_time 
	
	FROM public_user_session s 
	INNER JOIN public_user a ON (s.user_id = a.id)
	INNER JOIN user_group c ON (a.group_id = c.id)
	INNER JOIN user_group_menu d ON (c.id = d.group_id) 
	INNER JOIN user_menu e ON  (d.menu_id = e.id)
	WHERE 
	s.deleted <> 1 AND s.status = 1 AND
	a.deleted <> 1 AND a.status =1  AND
	c.deleted <> 1 AND c.status = 1 AND
	e.deleted <> 1 AND e.status = 1 
UNION ALL
	SELECT DISTINCT
	s.session_id AS session_id,
	0 AS nodes,
	a.id AS user_id, 
	
	d.right_id,
	
	e.id AS temp_id, e.ref_id AS parent_id,  
	e.menu_key AS menu_key, 
	e.title_en AS temp_name_en, e.title_cn AS temp_name_cn,
	e.desc_en AS temp_desc_en, e.desc_cn AS temp_desc_cn,
	e.url, e.template, e.orderno, e.created_time 
	
	FROM public_user_session s 
	INNER JOIN public_user a ON (s.user_id = a.id)
	INNER JOIN user_group c ON (a.group_id = c.id)
	INNER JOIN user_group_template d ON (c.id = d.group_id) 
	INNER JOIN user_template e ON  (d.temp_id = e.id)
	WHERE 
	s.deleted <> 1 AND s.status = 1 AND
	a.deleted <> 1 AND a.status =1  AND
	c.deleted <> 1 AND c.status = 1 AND
	e.deleted <> 1 AND e.status = 1 
	ORDER BY user_id, menu_id,  orderno DESC, created_time;
	
/**********************************************/
 
 
/*** multi language content ***/
CREATE VIEW vw_info_content 
AS
SELECT  a.id, a.filter_id, a.user_id, d.id as category_id, a.class_id, 
		a.publish_by, a.publish_time, a.email, a.phone, a.cell, a.fax,
		a.address, a.city, a.state, 
		a.memo, a.seo_keyword, a.seo_desc, 
		a.orderno, a.status, a.deleted, a.hits, a.reviews, a.created_time, a.last_updated,
 		b.plist, b.pview, b.pedit, b.ulist, b.uview, b.uedit,
		 
		IF(a.title_en='', 	a.title_cn, a.title_en) 	AS a_title_en, 	IF(a.title_cn='', a.title_en, a.title_cn) 	AS a_title_cn,
 		IF(a.desc_en='', 	a.desc_cn, 	a.desc_en) 		AS a_desc_en, 	IF(a.desc_cn='', a.desc_en, a.desc_cn) 		AS a_desc_cn,
 		IF(a.detail_en='', 	a.detail_cn,a.detail_en) 	AS a_detail_en, IF(a.detail_cn='', a.detail_en, a.detail_cn) AS a_detail_cn,

		IF(b.title_en='', 	b.title_cn, b.title_en) 	AS b_title_en, 	IF(b.title_cn='', b.title_en, b.title_cn) 	AS b_title_cn,
 		IF(b.desc_en='', 	b.desc_cn, 	b.desc_en) 		AS b_desc_en, 	IF(b.desc_cn='', b.desc_en, b.desc_cn) 		AS b_desc_cn,

		IF(c.title_en='', 	c.title_cn, c.title_en) 	AS c_title_en, 	IF(c.title_cn='', c.title_en, c.title_cn) 	AS c_title_cn,
 		IF(c.desc_en='', 	c.desc_cn, 	c.desc_en) 		AS c_desc_en, 	IF(c.desc_cn='', c.desc_en, c.desc_cn) 		AS c_desc_cn,

		IF(d.title_en='', 	d.title_cn, d.title_en) 	AS d_title_en, 	IF(d.title_cn='', d.title_en, d.title_cn) 	AS d_title_cn,
 		IF(d.desc_en='', 	d.desc_cn, 	d.desc_en) 		AS d_desc_en, 	IF(d.desc_cn='', d.desc_en, d.desc_cn) 		AS d_desc_cn
FROM info_content a 
INNER JOIN info_filter b ON (a.filter_id = b.id)
INNER JOIN info_class c ON (a.class_id = c.id) 
INNER JOIN info_category d ON (c.ref_id = d.id)
WHERE a.deleted <> 1 AND a.status = 1 
 
 




