You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'sq.ft AND 6000 sq.ft AND (FIND_IN_SET('3',p.amenities_id) OR FIND_IN_SET('1',p.a' at line 4

SELECT p.*,pt.name,if((select COUNT(id) FROM favorites WHERE property_id = p.id AND user_id = '119') >0,1,0) as is_favorite,u.full_name,if(u.profile_picture !='',CONCAT( 'http://192.168.1.100/realstir/','assets/upload/users/thumb/',u.profile_picture),'') as profile_picture_thumb, if(u.profile_picture !='',CONCAT( 'http://192.168.1.100/realstir/','assets/upload/users/original/',u.profile_picture),'') as profile_picture_url FROM propertys as p LEFT JOIN property_types as pt ON pt.id=p.property_type_id LEFT JOIN users as u ON u.id = p.added_by WHERE p.is_verified =1 AND p.status=0 AND p.property_sub_type = '0' AND p.amount BETWEEN 500 AND 10000 AND p.bedrooms = '5' AND p.property_type_id = '1' AND p.furnishing_status = '6' AND p.saleable_area BETWEEN 4000 sq.ft AND 6000 sq.ft AND (FIND_IN_SET('3',p.amenities_id) OR FIND_IN_SET('1',p.amenities_id) OR FIND_IN_SET('9',p.amenities_id) OR FIND_IN_SET('4',p.amenities_id) ) AND (p.address LIKE '%rajkot%') ORDER BY p.added_date DESC

<?php   if (!defined('BASEPATH')) exit('No direct script access allowed');
	class Property_model extends MY_Generic_Model{
	  
	  //initialize
	  
	  	public function __construct()
	  	{
		  	parent::__construct();
	  	
	  	}

		public function get_property_types()
		{
			if ( $this->data['order_by']  == '')
			{
				$query 	= "SELECT * FROM ".$this->tables ["property_types"]." WHERE  1=1  ".$this->data['search_text']."  ORDER BY id DESC LIMIT ".$this->data['limit_start'].",".$this->data['limit_length']." ";
				$query_count = "SELECT COUNT(id) as total FROM ".$this->tables ["property_types"]."  WHERE 1=1 ".$this->data['search_text'];
		
			}
			else
			{
				$query 	= "SELECT * FROM ".$this->tables ["property_types"]."  WHERE 1=1 ".$this->data['search_text']."  ORDER BY ".$this->data['order_by']." LIMIT ".$this->data['limit_start'].",".$this->data['limit_length']." ";
				$query_count = "SELECT COUNT(id) as total FROM ".$this->tables ["property_types"]."  WHERE 1=1".$this->data['search_text'];

			}
			
			$result = $this->query_result($query);
			$total  = $this->query_result($query_count);			
			return array('total'=>$total[0]->total,"result"=>$result) ;
		}	

		public function getPropertyTypes()
		{
			$query  = $this->query("SELECT * FROM ".$this->tables["property_types"]." ORDER BY name ASC");
			if ( $query->result_id->num_rows > 0 )
			{
				$data = $query->result_array();
				$returnArray = array();
				$i=0;
				foreach ($data as $row) {
					$returnArray[$i] = $row;
					$returnArray[$i]['image_app'] = base_url().'assets/upload/property_types/original/'.$row['image'];
					$returnArray[$i]['image_thumb_app'] = base_url().'assets/upload/property_types/thumb/'.$row['image'];
					$i++;
				}
				return $returnArray;
			}
    		else
	   		{
   	 			return array();
   			}
		}

		public function getAdditionalRooms()
		{
			$query  = $this->query("SELECT * FROM ".$this->tables["additional_rooms"]." ORDER BY name ASC");
			if ( $query->result_id->num_rows > 0 )
			{
				$data = $query->result_array();
				$returnArray = array();
				$i=0;
				foreach ($data as $row) {
					$returnArray[$i] = $row;
					$returnArray[$i]['image_app'] = base_url().'assets/upload/additional_rooms/original/'.$row['image'];
					$returnArray[$i]['image_thumb_app'] = base_url().'assets/upload/additional_rooms/thumb/'.$row['image'];
					$i++;
				}
				return $returnArray;
			}
    		else
	   		{
   	 			return array();
   			}
		}

		public function getAdditionalFurnishing()
		{
			$query  = $this->query("SELECT * FROM ".$this->tables["additional_furnishing"]." ORDER BY name ASC");
			if ( $query->result_id->num_rows > 0 )
			{
				$data = $query->result_array();
				$returnArray = array();
				$i=0;
				foreach ($data as $row) {
					$returnArray[$i] = $row;
					$returnArray[$i]['image_app'] = base_url().'assets/upload/additional_furnishing/original/'.$row['image'];
					$returnArray[$i]['image_thumb_app'] = base_url().'assets/upload/additional_furnishing/thumb/'.$row['image'];
					$i++;
				}
				return $returnArray;
			}
    		else
	   		{
   	 			return array();
   			}
		}

		public function getAmenities()
		{
			$query  = $this->query("SELECT * FROM ".$this->tables["amenities"]." ORDER BY name ASC");
			if ( $query->result_id->num_rows > 0 )
			{
				$data = $query->result_array();
				$returnArray = array();
				$i=0;
				foreach ($data as $row) {
					$returnArray[$i] = $row;
					$returnArray[$i]['image_app'] = base_url().'assets/upload/amenities/original/'.$row['image'];
					$returnArray[$i]['image_thumb_app'] = base_url().'assets/upload/amenities/thumb/'.$row['image'];
					$i++;
				}
				return $returnArray;
			}
    		else
	   		{
   	 			return array();
   			}
		}

		public function getOverlooking()
		{
			$query  = $this->query("SELECT * FROM ".$this->tables["overlooking"]." ORDER BY name ASC");
			if ( $query->result_id->num_rows > 0 )
			{
				$data = $query->result_array();
				$returnArray = array();
				$i=0;
				foreach ($data as $row) {
					$returnArray[$i] = $row;
					$returnArray[$i]['image_app'] = base_url().'assets/upload/overlooking/original/'.$row['image'];
					$returnArray[$i]['image_thumb_app'] = base_url().'assets/upload/overlooking/thumb/'.$row['image'];
					$i++;
				}
				return $returnArray;
			}
    		else
	   		{
   	 			return array();
   			}
		}

		public function getpropertyList()
		{
			$sWhere='';
			$strLimit = '';
			if(isset($this->data['sp']))
			{
				$strLimit = "LIMIT ".$this->data['sp'].",".$this->data['limit'];
			}
		
			if(isset($this->data['property_sub_type']) && $this->data['property_sub_type'] !="")
			{
				$sWhere .= " AND p.property_sub_type = '".$this->data['property_sub_type']."'";
			}
			if(isset($this->data['budget_min']) && $this->data['budget_min'] !="" && isset($this->data['budget_max']) && $this->data['budget_max'] !="")
			{
				$sWhere .= " AND p.amount BETWEEN ".$this->data['budget_min']." AND ".$this->data['budget_max']."";
			}
	
			if(isset($this->data['bhk']) && $this->data['bhk'] !="")
			{
				$sWhere .= " AND p.bedrooms = '".$this->data['bhk']."'";
			}

			if(isset($this->data['property_type_id']) && $this->data['property_type_id'] !="")
			{
				$sWhere .= " AND p.property_type_id = '".$this->data['property_type_id']."'";
			}
			if(isset($this->data['furnishing_status']) && $this->data['furnishing_status'] !="")
			{
				$sWhere .= " AND p.furnishing_status = '".$this->data['furnishing_status']."'";
			}
			if(isset($this->data['transaction_type']) && $this->data['transaction_type'] !="")
			{
				$sWhere .= " AND p.transaction_type = '".$this->data['transaction_type']."'";
			}
			
			if(isset($this->data['saleable_area_min']) && $this->data['saleable_area_min'] !="" && isset($this->data['saleable_area_max']) && $this->data['saleable_area_max'] !="")
			{
				$sWhere .= " AND p.saleable_area BETWEEN ".$this->data['saleable_area_min']." AND ".$this->data['saleable_area_max']."";
			}
			
			if(isset($this->data['floor_no']) && $this->data['floor_no'] !="")
			{
				$sWhere .= " AND p.floor_no = '".$this->data['floor_no']."'";
			}
			if(isset($this->data['total_floor']) && $this->data['total_floor'] !="")
			{
				$sWhere .= " AND p.total_floor = '".$this->data['total_floor']."'";
			}
			if(isset($this->data['amenities_id']) && $this->data['amenities_id'] !="")
			{
				$amen_id = array_filter(explode(',',$this->data['amenities_id']));
				$strSuborgQry = "";
				if(!empty($amen_id)) {
						$strSuborgQry .= " AND (";
						foreach ($amen_id as $key => $value) {
							if($key == 0) {
								$strSuborgQry .= "FIND_IN_SET('".$value."',p.amenities_id)";
							} else {
								$strSuborgQry .= " OR FIND_IN_SET('".$value."',p.amenities_id) ";
							}
							
						}
						$strSuborgQry .= ")";
					}
				$strSubQry = "".$strSuborgQry."";
				$sWhere .= $strSubQry;
			}
			
			if(isset($this->data['address']) && $this->data['address'] !="")
			{
				$address = explode(' ',$this->data['address']);
				$i=1;
				$totalCount = count($address);				
				$sWhere .= " AND (";	
				foreach( $address as $row )
				{					
					$sWhere .= "p.address LIKE '%".($row)."%'";

					if($totalCount != $i){
						$sWhere .= " OR ";
					}		
					$i++;
				}	
				$sWhere .= ")";
			}


			if(isset($this->data['latitude']) && $this->data['latitude'] !="" && isset($this->data['longitude']) && $this->data['longitude'] !="" && isset($this->data['distance']) && $this->data['distance'] !="")
			{
				$latitude=$this->data['latitude'];
				$longitude=$this->data['longitude'];
				$this->distance=str_replace("@LATITUDE@", $latitude, $this->distance);
				$this->distance=str_replace("@LONGITUDE@", $longitude, $this->distance);
				$distance = $this->data['distance'];

				$sWhere .= "AND ".$this->distance." <= $distance";
			}
			
			$baseUrl = base_url();
			$thumburl=  $this->config->item('user_profile_thumb');
			$url = $this->config->item('user_profile_picture');

			$result 	= $this->query("SELECT p.*,pt.name,if((select COUNT(id) FROM ".$this->tables ["favorites"]." WHERE property_id = p.id AND user_id = '".$this->data['user_id']."') >0,1,0) as is_favorite,u.full_name,if(u.profile_picture !='',CONCAT( '".$baseUrl."','".$thumburl."',u.profile_picture),'') as profile_picture_thumb,
			 if(u.profile_picture !='',CONCAT( '".$baseUrl."','".$url."',u.profile_picture),'') as profile_picture_url FROM ".$this->tables['propertys']." as p LEFT JOIN ".$this->tables['property_types']." as pt ON pt.id=p.property_type_id 
				LEFT JOIN ".$this->tables['users']." as u ON u.id = p.added_by
				WHERE p.is_verified =1 AND p.status=0 $sWhere ORDER BY p.added_date DESC ".$strLimit."");						

			if($result->result_id->num_rows > 0)
			{
				$data = $result->result_array();

				$returnArray = array();
				$i=0;
				foreach($data as $row)
				{
					$returnArray[$i]['id'] = $row['id'];
					$returnArray[$i]['added_by'] = $row['added_by'];
					$returnArray[$i]['full_name'] = $row['full_name']?$row['full_name']:"";
					$returnArray[$i]['profile_picture'] = $row['profile_picture_url'];
					$returnArray[$i]['profile_picture_thumb'] = $row['profile_picture_thumb'];

					$returnArray[$i]['property_type_id'] = $row['property_type_id'];
					$returnArray[$i]['property_type_name'] = $row['name'];
					$returnArray[$i]['property_sub_type'] = $row['property_sub_type'];
					$returnArray[$i]['property_name'] = $row['property_name'];
					$returnArray[$i]['address'] = $row['address'];
					$returnArray[$i]['bedrooms'] = $row['bedrooms'];
					$returnArray[$i]['bathrooms'] = $row['bathrooms'];
					$returnArray[$i]['balconies'] = $row['balconies'];
					$returnArray[$i]['additional_rooms_id'] = $row['additional_rooms_id']?$row['additional_rooms_id']:"";
					$returnArray[$i]['saleable_area'] = $row['saleable_area'];
					$returnArray[$i]['carpet_area'] = $row['carpet_area'];
					$returnArray[$i]['negotiable'] = $row['negotiable'];
					$returnArray[$i]['amount'] = $row['amount'];
					$returnArray[$i]['booking_amount'] = $row['booking_amount'];
					$returnArray[$i]['security_deposit'] = $row['security_deposit'];
					$returnArray[$i]['maintenance_charge'] = $row['maintenance_charge'];
					$returnArray[$i]['nosecurity_deposit'] = $row['nosecurity_deposit'];
					if( $row['available_from'] != '0000-00-00')
					{
						$returnArray[$i]['available_from'] = $row['available_from'];
					}
					else
					{
						$returnArray[$i]['available_from'] = "";
					}
					$returnArray[$i]['property_status'] = $row['property_status'];
					$returnArray[$i]['age_property'] = $row['age_property']?$row['age_property']:"";
					if( $row['available_from'] != '0000-00-00')
					{
						$returnArray[$i]['possession_date'] = $row['possession_date'];
					}
					else
					{
						$returnArray[$i]['possession_date'] ="";
					}
					$returnArray[$i]['transaction_type'] = $row['transaction_type'];
					$returnArray[$i]['description'] = $row['description'];
					$returnArray[$i]['furnishing_status'] = $row['furnishing_status'];
					$returnArray[$i]['additional_furnishing_id'] = $row['additional_furnishing_id'];
					$returnArray[$i]['amenities_id'] = $row['amenities_id'];
					$returnArray[$i]['floor_no'] = $row['floor_no'];
					$returnArray[$i]['total_floor'] = $row['total_floor'];
					$returnArray[$i]['open_side'] = $row['open_side'];
					$returnArray[$i]['facing'] = $row['facing'];
					$returnArray[$i]['facing_road_width'] = $row['facing_road_width'];
					$returnArray[$i]['overlooking_id'] = $row['overlooking_id'];
					$returnArray[$i]['latitude'] = $row['latitude'];
					$returnArray[$i]['longitude'] = $row['longitude'];
					$returnArray[$i]['preferred_tenants'] = $row['preferred_tenants'];
					$returnArray[$i]['gender_preference'] = $row['gender_preference'];
					$returnArray[$i]['maximum_tentants_allowed'] = $row['maximum_tentants_allowed'];
					$returnArray[$i]['work_preference'] = $row['work_preference'];
					$returnArray[$i]['dietary_food_preference'] = $row['dietary_food_preference'];
					$returnArray[$i]['expected_duration'] = $row['expected_duration'];
					$returnArray[$i]['special_requirements'] = $row['special_requirements'];
					$returnArray[$i]['property_owner_name'] = $row['property_owner_name'];
					$returnArray[$i]['property_owner_number'] = $row['property_owner_number'];
					$returnArray[$i]['property_owner_photo'] = "";
					$returnArray[$i]['inquiry_time'] = $row['inquiry_time'];
					$returnArray[$i]['added_date'] = $row['added_date'];
					$returnArray[$i]['is_favorite'] = $row['is_favorite'];
					$returnArray[$i]['added_by'] = $row['added_by'];

					$query  = $this->query("SELECT id,image FROM ".$this->tables["propertys_image"]." WHERE property_id = '".$row['id']."'");
					$ImageArray = array();
					if ( $query->result_id->num_rows > 0 )
					{
						$data = $query->result_array();
						$j=0;
						foreach ($data as $image) {
							$ImageArray[$j]['id'] = $image['id']; 
							$ImageArray[$j]['image'] = base_url().'assets/upload/propertys/original/'.$image['image']; 
							$ImageArray[$j]['image_thumb'] = base_url().'assets/upload/propertys/thumb/'.$image['image']; 
							$j++;
						}
						$returnArray[$i]['images'] = $ImageArray;

					}
		    		else
			   		{
		   	 			$returnArray[$i]['images'] = array();
		   			}

					$i++;
				}
				return $returnArray;
			}
			else
			{
				return array();
			}	
		}

		public function getpropertyDetail()
		{
			$result 	= $this->query("SELECT p.*,pt.name,if((select COUNT(id) FROM ".$this->tables ["favorites"]." WHERE property_id = p.id AND user_id = '".$this->data['user_id']."') >0,1,0) as is_favorite,
				CASE p.negotiable WHEN 0 THEN 'No' ELSE 'Yes' END AS negotiableStatus,
				CASE p.property_status WHEN 1 THEN 'Ready To Move In' ELSE 'Under Construction' END AS propertyStatus,
				CASE p.transaction_type WHEN 1 THEN 'New' ELSE 'Resale' END AS transactionStatus,
				DATE_FORMAT(p.possession_date, '%d %M %Y') as possessionDate,
				CASE p.nosecurity_deposit WHEN 0 THEN 'Yes' ELSE 'No' END AS depositStatus,
				DATE_FORMAT(p.available_from, '%d %M %Y') as availableFrom,
				CASE p.furnishing_status WHEN 1 THEN 'Unfurnished' WHEN '2' THEN 'Semi Furnished' ELSE 'Fully Furnished' END AS furnishingType,
				CASE p.preferred_tenants WHEN 1 THEN 'Family' WHEN '2' THEN 'Bachelors' ELSE 'All' END AS tenantsType,
				CASE p.gender_preference WHEN 1 THEN 'Only Men' WHEN '2' THEN 'Only Women' ELSE 'All' END AS genderType,
				CASE p.maximum_tentants_allowed WHEN 1 THEN '1-2' WHEN '2' THEN '3-4' ELSE 'More Than 4' END AS maxtenantsType,
				CASE p.work_preference WHEN 1 THEN 'Salaried' WHEN '2' THEN 'Student' WHEN '3' THEN 'Businessmen' ELSE 'All' END AS workPreference,
				CASE p.dietary_food_preference WHEN 1 THEN 'Only Vegetarians' WHEN '2' THEN 'Non-Veg Allowed' ELSE 'No Preference' END AS dietaryfoodPereference,
				CASE p.expected_duration WHEN 1 THEN 'Atleast 6 Months' WHEN '2' THEN 'Atleast 1 Year' WHEN '3' THEN 'Atleast 2 Years' ELSE 'No Preference' END AS expectedDuration,

				CASE p.added_by WHEN 0 THEN 'Admin' ELSE 'User' END AS addedBy,
				CASE p.is_verified WHEN 0 THEN 'Unverified' ELSE 'Verified' END AS isVerified,
				CASE p.status WHEN 0 THEN 'Pending' ELSE 'Completed' END AS PStatus,
				DATE_FORMAT(p.added_date, '%d %M %Y') as Created
			 	FROM ".$this->tables['propertys']." as p LEFT JOIN ".$this->tables['property_types']." as pt ON pt.id=p.property_type_id WHERE  p.status=0 AND p.id='".$this->data['property_id']."'");					

			if($result->result_id->num_rows > 0)
			{
				$row = $result->row_array();

				$returnArray = array();
				
				$returnArray['id'] = $row['id'];
				$returnArray['property_type_id'] = $row['property_type_id'];
				$returnArray['property_type_name'] = $row['name'];
				$returnArray['property_sub_type'] = $row['property_sub_type'];
				$returnArray['property_name'] = $row['property_name'];
				$returnArray['address'] = $row['address'];
				$returnArray['bedrooms'] = $row['bedrooms'];
				$returnArray['bathrooms'] = $row['bathrooms'];
				$returnArray['balconies'] = $row['balconies'];
				$returnArray['additional_rooms_id'] = $row['additional_rooms_id']?$row['additional_rooms_id']:"";
				$returnArray['saleable_area'] = $row['saleable_area'];
				$returnArray['carpet_area'] = $row['carpet_area'];
				$returnArray['negotiable'] = $row['negotiable'];
				$returnArray['negotiableStatus'] = $row['negotiableStatus'];
				$returnArray['amount'] = $row['amount'];
				$returnArray['booking_amount'] = $row['booking_amount'];
				$returnArray['security_deposit'] = $row['security_deposit'];
				$returnArray['maintenance_charge'] = $row['maintenance_charge'];
				$returnArray['nosecurity_deposit'] = $row['nosecurity_deposit'];
				$returnArray['depositStatus'] = $row['depositStatus'];

				$returnArray['tenantsType'] = $row['tenantsType'];
				$returnArray['genderType'] = $row['genderType'];
				$returnArray['maxtenantsType'] = $row['maxtenantsType'];
				
				$returnArray['workPreference'] = $row['workPreference'];
				$returnArray['dietaryfoodPereference'] = $row['dietaryfoodPereference'];
				$returnArray['expectedDuration'] = $row['expectedDuration'];
				
				if( $row['available_from'] != '0000-00-00')
				{
					$returnArray['available_from'] = $row['available_from'];
					$returnArray['availableFrom'] = $row['availableFrom'];
					
				}
				else
				{
					$returnArray['available_from'] = "";
					$returnArray['availableFrom'] = "";
				}
				$returnArray['property_status'] = $row['property_status'];
				$returnArray['propertyStatus'] = $row['propertyStatus'];
				$returnArray['age_property'] = $row['age_property']?$row['age_property']:"";
				if( $row['possession_date'] != '0000-00-00')
				{
					$returnArray['possession_date'] = $row['possession_date'];
					$returnArray['possessionDate'] = $row['possessionDate'];
				}
				else
				{
					$returnArray['possession_date'] ="";
					$returnArray['possessionDate'] ="";
				}
				$returnArray['transaction_type'] = $row['transaction_type'];
				$returnArray['transactionStatus'] = $row['transactionStatus'];
				$returnArray['description'] = $row['description'];
				$returnArray['furnishing_status'] = $row['furnishing_status'];
				$returnArray['furnishingType'] = $row['furnishingType'];
				$returnArray['additional_furnishing_id'] = $row['additional_furnishing_id'];
				$returnArray['amenities_id'] = $row['amenities_id'];
				$returnArray['floor_no'] = $row['floor_no'];
				$returnArray['total_floor'] = $row['total_floor'];
				$returnArray['open_side'] = $row['open_side'];
				$returnArray['facing'] = $row['facing'];
				$returnArray['facing_road_width'] = $row['facing_road_width'];
				$returnArray['overlooking_id'] = $row['overlooking_id'];
				$returnArray['latitude'] = $row['latitude'];
				$returnArray['longitude'] = $row['longitude'];
				$returnArray['preferred_tenants'] = $row['preferred_tenants'];
				$returnArray['gender_preference'] = $row['gender_preference'];
				$returnArray['maximum_tentants_allowed'] = $row['maximum_tentants_allowed'];
				$returnArray['work_preference'] = $row['work_preference'];
				$returnArray['dietary_food_preference'] = $row['dietary_food_preference'];
				$returnArray['expected_duration'] = $row['expected_duration'];
				$returnArray['special_requirements'] = $row['special_requirements'];
				$returnArray['property_owner_name'] = $row['property_owner_name'];
				$returnArray['property_owner_number'] = $row['property_owner_number'];
				$returnArray['property_owner_photo'] = "";
				$returnArray['inquiry_time'] = $row['inquiry_time'];
				$returnArray['added_date'] = $row['added_date'];
				$returnArray['Created'] = $row['Created'];
				
				$returnArray['is_favorite'] = $row['is_favorite'];
				$returnArray['added_by'] = $row['added_by'];
				$returnArray['addedBy'] = $row['addedBy'];
				$returnArray['isVerified'] = $row['isVerified'];
				$returnArray['PStatus'] = $row['PStatus'];
				
				

				$query  = $this->query("SELECT id,image FROM ".$this->tables["propertys_image"]." WHERE property_id = '".$row['id']."'");
				$ImageArray = array();
				if ( $query->result_id->num_rows > 0 )
				{
					$data = $query->result_array();
					$j=0;
					foreach ($data as $image) {
							$ImageArray[$j]['id'] = $image['id']; 
							$ImageArray[$j]['image'] = base_url().'assets/upload/propertys/original/'.$image['image']; 
							$ImageArray[$j]['image_thumb'] = base_url().'assets/upload/propertys/thumb/'.$image['image']; 
							$j++;
					}
					$returnArray['images'] = $ImageArray;

				}
		    	else
			   	{
		   	 		$returnArray['images'] = array();
		   		}

		   		$additional_rooms_id = $row['additional_rooms_id'];
	   			if($row['additional_rooms_id']=="")
	   			{
	   				$additional_rooms_id = 0;
	   			}
				$Rquery  = $this->query("SELECT id,name,image FROM ".$this->tables["additional_rooms"]." WHERE id IN(".$additional_rooms_id.")");
				$RoomArray = array();
				if ( $Rquery->result_id->num_rows > 0 )
				{
					$Rdata = $Rquery->result_array();
					$j=0;
					foreach ($Rdata as $room) {
						$RoomArray[$j]['id'] = $room['id']; 
						$RoomArray[$j]['name'] = $room['name']; 
						$RoomArray[$j]['image'] = base_url().'assets/upload/additional_rooms/original/'.$room['image']; 
						$j++;
					}
					$returnArray['roomArray'] = $RoomArray;

				}
	    		else
		   		{
	   	 			$returnArray['roomArray'] = array();
	   			}

	   			$additional_furnishing_id = $row['additional_furnishing_id'];
	   			if($row['additional_furnishing_id']=="")
	   			{
	   				$additional_furnishing_id = 0;
	   			}

	   			$Fquery  = $this->query("SELECT id,name,image FROM ".$this->tables["additional_furnishing"]." WHERE id IN(".$additional_furnishing_id.")");
				$furnishingArray = array();
				if ( $Fquery->result_id->num_rows > 0 )
				{
					$Fdata = $Fquery->result_array();
					$k=0;
					foreach ($Fdata as $furnishing) {
						$furnishingArray[$k]['id'] = $furnishing['id']; 
						$furnishingArray[$k]['name'] = $furnishing['name']; 
						$furnishingArray[$k]['image'] = base_url().'assets/upload/additional_furnishing/original/'.$furnishing['image']; 
						$k++;
					}
					$returnArray['furnishingArray'] = $furnishingArray;

				}
	    		else
		   		{
	   	 			$returnArray['furnishingArray'] = array();
	   			}

	   			$amenities_id = $row['amenities_id'];
	   			if($row['amenities_id']=="")
	   			{
	   				$amenities_id = 0;
	   			}

	   			$Aquery  = $this->query("SELECT id,name,image FROM ".$this->tables["amenities"]." WHERE id IN(".$amenities_id.")");
				$amenitiesArray = array();
				if ( $Aquery->result_id->num_rows > 0 )
				{
					$Adata = $Aquery->result_array();
					$l=0;
					foreach ($Adata as $amenities) {
						$amenitiesArray[$l]['id'] = $amenities['id']; 
						$amenitiesArray[$l]['name'] = $amenities['name']; 
						$amenitiesArray[$l]['image'] = base_url().'assets/upload/amenities/original/'.$amenities['image']; 
						$l++;
					}
					$returnArray['amenitiesArray'] = $amenitiesArray;

				}
	    		else
		   		{
	   	 			$returnArray['amenitiesArray'] = array();
	   			}
	   			$overlooking_id = $row['overlooking_id'];
	   			if($row['overlooking_id']=="")
	   			{
	   				$overlooking_id = 0;
	   			}
	   			$Oquery  = $this->query("SELECT id,name,image FROM ".$this->tables["overlooking"]." WHERE id IN(".$overlooking_id.")");
				$overlookingArray = array();
				if ( $Oquery->result_id->num_rows > 0 )
				{
					$Odata = $Oquery->result_array();
					$m=0;
					foreach ($Odata as $overlooking) {
						$overlookingArray[$m]['id'] = $overlooking['id']; 
						$overlookingArray[$m]['name'] = $overlooking['name']; 
						$overlookingArray[$m]['image'] = base_url().'assets/upload/overlooking/original/'.$overlooking['image']; 
						$m++;
					}
					$returnArray['overlookingArray'] = $overlookingArray;

				}
	    		else
		   		{
	   	 			$returnArray['overlookingArray'] = array();
	   			}

				return $returnArray;
			}
			else
			{
				return array();
			}	
		}

		public function isfavoritesExist()
		{
			$query = "SELECT id FROM ".$this->tables ["favorites"]." WHERE property_id='".$this->data['property_id']."' AND user_id='".$this->data['user_id']."'";
			$result =$this->query($query);
			if ( $result->result_id->num_rows > 0)
			{
				return $result->row();	
			}
			return false;
		}


		public function getFavoritesPropertys()
		{
			$sWhere='';
			$strLimit = '';
			if(isset($this->data['sp']))
			{
				$strLimit = "LIMIT ".$this->data['sp'].",".$this->data['limit'];
			}
		
			$baseUrl = base_url();
			$thumburl=  $this->config->item('user_profile_thumb');
			$url = $this->config->item('user_profile_picture');

			$result 	= $this->query("SELECT p.*,pt.name,if(u.profile_picture !='',CONCAT( '".$baseUrl."','".$thumburl."',u.profile_picture),'') as profile_picture_thumb,
			 if(u.profile_picture !='',CONCAT( '".$baseUrl."','".$url."',u.profile_picture),'') as profile_picture_url FROM ".$this->tables['favorites']." as f LEFT JOIN ".$this->tables['propertys']." as p ON p.id=f.property_id LEFT JOIN ".$this->tables['property_types']." as pt ON pt.id=p.property_type_id LEFT JOIN ".$this->tables['users']." as u ON u.id = p.added_by WHERE f.user_id = '".$this->data['user_id']."' ORDER BY f.id DESC ".$strLimit."");						
			
			if($result->result_id->num_rows > 0)
			{
				$data = $result->result_array();

				$returnArray = array();
				$i=0;
				foreach($data as $row)
				{
					$returnArray[$i]['id'] = $row['id'];
					$returnArray[$i]['profile_picture'] = $row['profile_picture_url'];
					$returnArray[$i]['profile_picture_thumb'] = $row['profile_picture_thumb'];
					$returnArray[$i]['property_type_id'] = $row['property_type_id'];
					$returnArray[$i]['property_type_name'] = $row['name'];
					$returnArray[$i]['property_sub_type'] = $row['property_sub_type'];
					$returnArray[$i]['property_name'] = $row['property_name'];
					$returnArray[$i]['address'] = $row['address'];
					$returnArray[$i]['bedrooms'] = $row['bedrooms'];
					$returnArray[$i]['bathrooms'] = $row['bathrooms'];
					$returnArray[$i]['balconies'] = $row['balconies'];
					$returnArray[$i]['additional_rooms_id'] = $row['additional_rooms_id']?$row['additional_rooms_id']:"";
					$returnArray[$i]['saleable_area'] = $row['saleable_area'];
					$returnArray[$i]['carpet_area'] = $row['carpet_area'];
					$returnArray[$i]['negotiable'] = $row['negotiable'];
					$returnArray[$i]['amount'] = $row['amount'];
					$returnArray[$i]['booking_amount'] = $row['booking_amount'];
					$returnArray[$i]['security_deposit'] = $row['security_deposit'];
					$returnArray[$i]['maintenance_charge'] = $row['maintenance_charge'];
					$returnArray[$i]['nosecurity_deposit'] = $row['nosecurity_deposit'];
					if( $row['available_from'] != '0000-00-00')
					{
						$returnArray[$i]['available_from'] = $row['available_from'];
					}
					else
					{
						$returnArray[$i]['available_from'] = "";
					}
					$returnArray[$i]['property_status'] = $row['property_status'];
					$returnArray[$i]['age_property'] = $row['age_property']?$row['age_property']:"";
					if( $row['possession_date'] != '0000-00-00')
					{
						$returnArray[$i]['possession_date'] = $row['possession_date'];
					}
					else
					{
						$returnArray[$i]['possession_date'] ="";
					}
					$returnArray[$i]['transaction_type'] = $row['transaction_type'];
					$returnArray[$i]['description'] = $row['description'];
					$returnArray[$i]['furnishing_status'] = $row['furnishing_status'];
					$returnArray[$i]['additional_furnishing_id'] = $row['additional_furnishing_id'];
					$returnArray[$i]['amenities_id'] = $row['amenities_id'];
					$returnArray[$i]['floor_no'] = $row['floor_no'];
					$returnArray[$i]['total_floor'] = $row['total_floor'];
					$returnArray[$i]['open_side'] = $row['open_side'];
					$returnArray[$i]['facing'] = $row['facing'];
					$returnArray[$i]['facing_road_width'] = $row['facing_road_width'];
					$returnArray[$i]['overlooking_id'] = $row['overlooking_id'];
					$returnArray[$i]['latitude'] = $row['latitude'];
					$returnArray[$i]['longitude'] = $row['longitude'];
					$returnArray[$i]['preferred_tenants'] = $row['preferred_tenants'];
					$returnArray[$i]['gender_preference'] = $row['gender_preference'];
					$returnArray[$i]['maximum_tentants_allowed'] = $row['maximum_tentants_allowed'];
					$returnArray[$i]['work_preference'] = $row['work_preference'];
					$returnArray[$i]['dietary_food_preference'] = $row['dietary_food_preference'];
					$returnArray[$i]['expected_duration'] = $row['expected_duration'];
					$returnArray[$i]['special_requirements'] = $row['special_requirements'];
					$returnArray[$i]['property_owner_name'] = $row['property_owner_name'];
					$returnArray[$i]['property_owner_number'] = $row['property_owner_number'];
					$returnArray[$i]['property_owner_photo'] = "";
					$returnArray[$i]['inquiry_time'] = $row['inquiry_time'];
					$returnArray[$i]['added_date'] = $row['added_date'];
					$returnArray[$i]['added_by'] = $row['added_by'];

					$query  = $this->query("SELECT id,image FROM ".$this->tables["propertys_image"]." WHERE property_id = '".$row['id']."'");
					$ImageArray = array();
					if ( $query->result_id->num_rows > 0 )
					{
						$data = $query->result_array();
						$j=0;
						foreach ($data as $image) {
							$ImageArray[$j]['id'] = $image['id']; 
							$ImageArray[$j]['image'] = base_url().'assets/upload/propertys/original/'.$image['image']; 
							$ImageArray[$j]['image_thumb'] = base_url().'assets/upload/propertys/thumb/'.$image['image']; 
							$j++;
						}
						$returnArray[$i]['images'] = $ImageArray;

					}
		    		else
			   		{
		   	 			$returnArray[$i]['images'] = array();
		   			}

					$i++;
				}
				return $returnArray;
			}
			else
			{
				return array();
			}	
		}


		public function get_propertys()
		{
			$strQuery = "ORDER BY id DESC";
			if ( $this->data['order_by']  != "")
			{
				$strQuery = "ORDER BY ".$this->data['order_by']."";
			}

			$query 	= "SELECT pt.name,pt.name as propertysname,CASE p.property_sub_type WHEN 0 THEN 'Buy' ELSE 'Rent' END AS propertysubtype,p.*,DATE_FORMAT(p.added_date, '%d %M %Y') as Created,
				CASE p.status WHEN 0 THEN 'Pending' ELSE 'Completed' END AS propertyStatus
				 FROM  ".$this->tables ["propertys"]." as p LEFT JOIN ".$this->tables ["property_types"]." as pt  ON p.property_type_id=pt.id 
				WHERE  1=1  ".$this->data['search_text']." $strQuery  
				LIMIT ".$this->data['limit_start'].",".$this->data['limit_length']." ";
			
			$query_count = "SELECT COUNT(p.id) as total FROM  ".$this->tables ["propertys"]." as p LEFT JOIN ".$this->tables ["property_types"]." as pt  ON p.property_type_id=pt.id   WHERE 1=1 ".$this->data['search_text'];
		
			$result = $this->query_result($query);
			$total  = $this->query_result($query_count);			
			return array('total'=>$total[0]->total,"result"=>$result) ;
		}

		public function propertyDetail()
		{
			$query = $this->query("SELECT pt.name,pt.name as propertysname,pt.image as propert_type_image,CASE p.property_sub_type WHEN 0 THEN 'Buy' ELSE 'Rent' END AS propertysubtype,p.*,DATE_FORMAT(p.added_date, '%d %M %Y') as Created,
				(SELECT GROUP_CONCAT(a.name) FROM ".$this->tables['additional_rooms']." as a WHERE FIND_IN_SET(a.id,p.additional_rooms_id)) as additionalrooms,
				(SELECT GROUP_CONCAT(am.name) FROM ".$this->tables['amenities']." as am WHERE FIND_IN_SET(am.id,p.amenities_id)) as amenities,
				(SELECT GROUP_CONCAT(af.name) FROM ".$this->tables['additional_furnishing']." as af WHERE FIND_IN_SET(af.id,p.additional_furnishing_id)) as additionalfurnishing,
				(SELECT GROUP_CONCAT(o.name) FROM ".$this->tables['overlooking']." as o WHERE FIND_IN_SET(o.id,p.overlooking_id)) as overlooking,
				CASE p.negotiable WHEN 0 THEN 'No' ELSE 'Yes' END AS negotiableStatus,
				CASE p.nosecurity_deposit WHEN 0 THEN 'Yes' ELSE 'No' END AS depositStatus,
				DATE_FORMAT(p.available_from, '%d %M %Y') as availableFrom,
				CASE p.property_status WHEN 1 THEN 'Ready To Move In' ELSE 'Under Construction' END AS propertyStatus,
				CASE p.transaction_type WHEN 1 THEN 'New' ELSE 'Resale' END AS transactionStatus,
				DATE_FORMAT(p.possession_date, '%d %M %Y') as possessionDate,
				CASE p.furnishing_status WHEN 1 THEN 'Unfurnished' WHEN '2' THEN 'Semi Furnished' ELSE 'Fully Furnished' END AS furnishingType,
				CASE p.preferred_tenants WHEN 1 THEN 'Family' WHEN '2' THEN 'Bachelors' ELSE 'All' END AS tenantsType,
				CASE p.gender_preference WHEN 1 THEN 'Only Men' WHEN '2' THEN 'Only Women' ELSE 'All' END AS genderType,
				CASE p.maximum_tentants_allowed WHEN 1 THEN '1-2' WHEN '2' THEN '3-4' ELSE 'More Than 4' END AS maxtenantsType,
				CASE p.work_preference WHEN 1 THEN 'Salaried' WHEN '2' THEN 'Student' WHEN '3' THEN 'Businessmen' ELSE 'All' END AS workPreference,
				CASE p.dietary_food_preference WHEN 1 THEN 'Only Vegetarians' WHEN '2' THEN 'Non-Veg Allowed' ELSE 'No Preference' END AS dietaryfoodPereference,
				CASE p.expected_duration WHEN 1 THEN 'Atleast 6 Months' WHEN '2' THEN 'Atleast 1 Year' WHEN '3' THEN 'Atleast 2 Years' ELSE 'No Preference' END AS expectedDuration,
				CASE p.added_by WHEN 0 THEN 'Admin' ELSE 'User' END AS addedBy,
				CASE p.is_verified WHEN 0 THEN 'Unverified' ELSE 'Verified' END AS isVerified,
				CASE p.status WHEN 0 THEN 'Pending' ELSE 'Completed' END AS PStatus
				FROM  ".$this->tables ["propertys"]." as p LEFT JOIN 
				".$this->tables ["property_types"]." as pt  ON p.property_type_id=pt.id 
				WHERE p.id='".$this->data['id']."'");
			if($query->result_id->num_rows > 0)
			{
				$data = $query->row_array();
				$additional_rooms_id = $data['additional_rooms_id'];
	   			if($data['additional_rooms_id']=="")
	   			{
	   				$additional_rooms_id = 0;
	   			}
				$Rquery  = $this->query("SELECT id,name,image FROM ".$this->tables["additional_rooms"]." WHERE id IN(".$additional_rooms_id.")");
				$RoomArray = array();
				if ( $Rquery->result_id->num_rows > 0 )
				{
					$Rdata = $Rquery->result_array();
					$j=0;
					foreach ($Rdata as $room) {
						$RoomArray[$j]['id'] = $room['id']; 
						$RoomArray[$j]['name'] = $room['name']; 
						$RoomArray[$j]['image'] = $room['image']; 
						$j++;
					}
					$data['roomArray'] = $RoomArray;

				}
	    		else
		   		{
	   	 			$data['roomArray'] = array();
	   			}

	   			$additional_furnishing_id = $data['additional_furnishing_id'];
	   			if($data['additional_furnishing_id']=="")
	   			{
	   				$additional_furnishing_id = 0;
	   			}

	   			$Fquery  = $this->query("SELECT id,name,image FROM ".$this->tables["additional_furnishing"]." WHERE id IN(".$additional_furnishing_id.")");
				$furnishingArray = array();
				if ( $Fquery->result_id->num_rows > 0 )
				{
					$Fdata = $Fquery->result_array();
					$k=0;
					foreach ($Fdata as $furnishing) {
						$furnishingArray[$k]['id'] = $furnishing['id']; 
						$furnishingArray[$k]['name'] = $furnishing['name']; 
						$furnishingArray[$k]['image'] = $furnishing['image']; 
						$k++;
					}
					$data['furnishingArray'] = $furnishingArray;

				}
	    		else
		   		{
	   	 			$data['furnishingArray'] = array();
	   			}

	   			$amenities_id = $data['amenities_id'];
	   			if($data['amenities_id']=="")
	   			{
	   				$amenities_id = 0;
	   			}

	   			$Aquery  = $this->query("SELECT id,name,image FROM ".$this->tables["amenities"]." WHERE id IN(".$amenities_id.")");
				$amenitiesArray = array();
				if ( $Aquery->result_id->num_rows > 0 )
				{
					$Adata = $Aquery->result_array();
					$l=0;
					foreach ($Adata as $amenities) {
						$amenitiesArray[$l]['id'] = $amenities['id']; 
						$amenitiesArray[$l]['name'] = $amenities['name']; 
						$amenitiesArray[$l]['image'] = $amenities['image']; 
						$l++;
					}
					$data['amenitiesArray'] = $amenitiesArray;

				}
	    		else
		   		{
	   	 			$data['amenitiesArray'] = array();
	   			}
	   			$overlooking_id = $data['overlooking_id'];
	   			if($data['overlooking_id']=="")
	   			{
	   				$overlooking_id = 0;
	   			}
	   			$Oquery  = $this->query("SELECT id,name,image FROM ".$this->tables["overlooking"]." WHERE id IN(".$overlooking_id.")");
				$overlookingArray = array();
				if ( $Oquery->result_id->num_rows > 0 )
				{
					$Odata = $Oquery->result_array();
					$m=0;
					foreach ($Odata as $overlooking) {
						$overlookingArray[$m]['id'] = $overlooking['id']; 
						$overlookingArray[$m]['name'] = $overlooking['name']; 
						$overlookingArray[$m]['image'] = $overlooking['image']; 
						$m++;
					}
					$data['overlookingArray'] = $overlookingArray;

				}
	    		else
		   		{
	   	 			$data['overlookingArray'] = array();
	   			}

				return $data;
			}
			else 
			{
				return array();
			}
		}	

		public function propertyimagesDetail($id)
		{
			$query = $this->query("SELECT * FROM propertys_image WHERE property_id='".$id."'");
			if($query->result_id->num_rows > 0)
			{
				return $query->result_array();
			}
			else 
			{
				return array();
			}
		}

		public function get_detail()
		{
			$result 	= $this->query("SELECT p.* FROM ".$this->tables['propertys']." as p WHERE p.id='".$this->data['property_id']."'");						

			if($result->result_id->num_rows > 0)
			{
				$row = $result->row_array();

				$returnArray = array();
				
				$returnArray['id'] = $row['id'];
				$returnArray['property_type_id'] = $row['property_type_id'];
				$returnArray['property_sub_type'] = $row['property_sub_type'];
				$returnArray['property_name'] = $row['property_name'];
				$returnArray['address'] = $row['address'];
				$returnArray['bedrooms'] = $row['bedrooms'];
				$returnArray['bathrooms'] = $row['bathrooms'];
				$returnArray['balconies'] = $row['balconies'];
				$returnArray['additional_rooms_id'] = $row['additional_rooms_id']?$row['additional_rooms_id']:"";
				$returnArray['saleable_area'] = $row['saleable_area'];
				$returnArray['carpet_area'] = $row['carpet_area'];
				$returnArray['negotiable'] = $row['negotiable'];
				$returnArray['amount'] = $row['amount'];
				$returnArray['booking_amount'] = $row['booking_amount'];
				$returnArray['security_deposit'] = $row['security_deposit'];
				$returnArray['maintenance_charge'] = $row['maintenance_charge'];
				$returnArray['nosecurity_deposit'] = $row['nosecurity_deposit'];
				if( $row['available_from'] != '0000-00-00')
				{
					$returnArray['available_from'] = $row['available_from'];
				}
				else
				{
					$returnArray['available_from'] = "";
				}
				$returnArray['property_status'] = $row['property_status'];
				$returnArray['age_property'] = $row['age_property']?$row['age_property']:"";

				if( $row['possession_date'] != '0000-00-00')
				{
					$returnArray['possession_date'] = $row['possession_date'];
				}
				else
				{
					$returnArray['possession_date'] ="";
				}
				$returnArray['transaction_type'] = $row['transaction_type'];
				$returnArray['description'] = $row['description'];
				$returnArray['furnishing_status'] = $row['furnishing_status'];
				$returnArray['additional_furnishing_id'] = $row['additional_furnishing_id'];
				$returnArray['amenities_id'] = $row['amenities_id'];
				$returnArray['floor_no'] = $row['floor_no'];
				$returnArray['total_floor'] = $row['total_floor'];
				$returnArray['open_side'] = $row['open_side'];
				$returnArray['facing'] = $row['facing'];
				$returnArray['facing_road_width'] = $row['facing_road_width'];
				$returnArray['overlooking_id'] = $row['overlooking_id'];
				$returnArray['latitude'] = $row['latitude'];
				$returnArray['longitude'] = $row['longitude'];
				$returnArray['preferred_tenants'] = $row['preferred_tenants'];
				$returnArray['gender_preference'] = $row['gender_preference'];
				$returnArray['maximum_tentants_allowed'] = $row['maximum_tentants_allowed'];
				$returnArray['work_preference'] = $row['work_preference'];
				$returnArray['dietary_food_preference'] = $row['dietary_food_preference'];
				$returnArray['expected_duration'] = $row['expected_duration'];
				$returnArray['special_requirements'] = $row['special_requirements'];
				$returnArray['property_owner_name'] = $row['property_owner_name'];
				$returnArray['property_owner_number'] = $row['property_owner_number'];
				$returnArray['inquiry_time'] = $row['inquiry_time'];

				$query  = $this->query("SELECT id,image FROM ".$this->tables["propertys_image"]." WHERE property_id = '".$row['id']."'");
				$ImageArray = array();
				if ( $query->result_id->num_rows > 0 )
				{
					$data = $query->result_array();
					$j=0;
					foreach ($data as $image) {
							$ImageArray[$j]['id'] = $image['id']; 
							$ImageArray[$j]['image'] = $image['image']; 
	
							$j++;
					}
					$returnArray['images'] = $ImageArray;

				}
		    	else
			   	{
		   	 		$returnArray['images'] = array();
		   		}

				return $returnArray;
			}
			else
			{
				return array();
			}	
		}

		public function get_image_detail()
		{
			$query = $this->query("SELECT * FROM propertys_image WHERE id='".$this->data['id']."'");
			if($query->result_id->num_rows > 0)
			{
				return $query->row_array();
			}
			else 
			{
				return array();
			}
		}


		public function getUserPropertyList()
		{
			$sWhere='';
			$strLimit = '';
			if(isset($this->data['sp']))
			{
				$strLimit = "LIMIT ".$this->data['sp'].",".$this->data['limit'];
			}

			$result 	= $this->query("SELECT p.*,pt.name,if((select COUNT(id) FROM ".$this->tables ["favorites"]." WHERE property_id = p.id AND user_id = '".$this->data['user_id']."') >0,1,0) as is_favorite FROM ".$this->tables['propertys']." as p LEFT JOIN ".$this->tables['property_types']." as pt ON pt.id=p.property_type_id WHERE p.status=0 AND added_by=".$this->data['user_id']."  ORDER BY p.added_date DESC ".$strLimit."");						

			if($result->result_id->num_rows > 0)
			{
				$data = $result->result_array();

				$returnArray = array();
				$i=0;
				foreach($data as $row)
				{
					$returnArray[$i]['id'] = $row['id'];
					$returnArray[$i]['property_type_id'] = $row['property_type_id'];
					$returnArray[$i]['property_type_name'] = $row['name'];
					$returnArray[$i]['property_sub_type'] = $row['property_sub_type'];
					$returnArray[$i]['property_name'] = $row['property_name'];
					$returnArray[$i]['address'] = $row['address'];
					$returnArray[$i]['bedrooms'] = $row['bedrooms'];
					$returnArray[$i]['bathrooms'] = $row['bathrooms'];
					$returnArray[$i]['balconies'] = $row['balconies'];
					$returnArray[$i]['additional_rooms_id'] = $row['additional_rooms_id']?$row['additional_rooms_id']:"";
					$returnArray[$i]['saleable_area'] = $row['saleable_area'];
					$returnArray[$i]['carpet_area'] = $row['carpet_area'];
					$returnArray[$i]['negotiable'] = $row['negotiable'];
					$returnArray[$i]['amount'] = $row['amount'];
					$returnArray[$i]['booking_amount'] = $row['booking_amount'];
					$returnArray[$i]['security_deposit'] = $row['security_deposit'];
					$returnArray[$i]['maintenance_charge'] = $row['maintenance_charge'];
					$returnArray[$i]['nosecurity_deposit'] = $row['nosecurity_deposit'];
					if( $row['available_from'] != '0000-00-00')
					{
						$returnArray[$i]['available_from'] = $row['available_from'];
					}
					else
					{
						$returnArray[$i]['available_from'] = "";
					}
					$returnArray[$i]['property_status'] = $row['property_status'];
					$returnArray[$i]['age_property'] = $row['age_property']?$row['age_property']:"";
					if( $row['available_from'] != '0000-00-00')
					{
						$returnArray[$i]['possession_date'] = $row['possession_date'];
					}
					else
					{
						$returnArray[$i]['possession_date'] ="";
					}
					$returnArray[$i]['transaction_type'] = $row['transaction_type'];
					$returnArray[$i]['description'] = $row['description'];
					$returnArray[$i]['furnishing_status'] = $row['furnishing_status'];
					$returnArray[$i]['additional_furnishing_id'] = $row['additional_furnishing_id'];
					$returnArray[$i]['amenities_id'] = $row['amenities_id'];
					$returnArray[$i]['floor_no'] = $row['floor_no'];
					$returnArray[$i]['total_floor'] = $row['total_floor'];
					$returnArray[$i]['open_side'] = $row['open_side'];
					$returnArray[$i]['facing'] = $row['facing'];
					$returnArray[$i]['facing_road_width'] = $row['facing_road_width'];
					$returnArray[$i]['overlooking_id'] = $row['overlooking_id'];
					$returnArray[$i]['latitude'] = $row['latitude'];
					$returnArray[$i]['longitude'] = $row['longitude'];
					$returnArray[$i]['preferred_tenants'] = $row['preferred_tenants'];
					$returnArray[$i]['gender_preference'] = $row['gender_preference'];
					$returnArray[$i]['maximum_tentants_allowed'] = $row['maximum_tentants_allowed'];
					$returnArray[$i]['work_preference'] = $row['work_preference'];
					$returnArray[$i]['dietary_food_preference'] = $row['dietary_food_preference'];
					$returnArray[$i]['expected_duration'] = $row['expected_duration'];
					$returnArray[$i]['special_requirements'] = $row['special_requirements'];
					$returnArray[$i]['property_owner_name'] = $row['property_owner_name'];
					$returnArray[$i]['property_owner_number'] = $row['property_owner_number'];
					$returnArray[$i]['property_owner_photo'] = "";
					$returnArray[$i]['inquiry_time'] = $row['inquiry_time'];
					$returnArray[$i]['added_date'] = $row['added_date'];
					$returnArray[$i]['is_favorite'] = $row['is_favorite'];
					$returnArray[$i]['added_by'] = $row['added_by'];

					$query  = $this->query("SELECT id,image FROM ".$this->tables["propertys_image"]." WHERE property_id = '".$row['id']."'");
					$ImageArray = array();
					if ( $query->result_id->num_rows > 0 )
					{
						$data = $query->result_array();
						$j=0;
						foreach ($data as $image) {
							$ImageArray[$j]['id'] = $image['id']; 
							$ImageArray[$j]['image'] = base_url().'assets/upload/propertys/original/'.$image['image']; 
							$ImageArray[$j]['image_thumb'] = base_url().'assets/upload/propertys/thumb/'.$image['image']; 
							$j++;
						}
						$returnArray[$i]['images'] = $ImageArray;

					}
		    		else
			   		{
		   	 			$returnArray[$i]['images'] = array();
		   			}

					$i++;
				}
				return $returnArray;
			}
			else
			{
				return array();
			}	
		}
}
?>