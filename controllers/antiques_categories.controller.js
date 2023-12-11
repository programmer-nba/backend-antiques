var jwt = require("jsonwebtoken");
var Category = require("../models/antiques/antiques_category.model");
var Category_type = require("../models/antiques/antiques_categories_type.model");
var Categories_detail = require("../models/antiques/antiques_categories_details.model");
var Categories_vendor = require("../models/antiques/antiques_categories_vendors.model");
const category_vendor = require("../models/antiques/antiques_categories_vendors.model");
const category_detail = require("../models/antiques/antiques_categories_details.model");
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;


module.exports.Getcategory = async (req, res) => {
    try{

        /*Get Data Antiques*/
       const getCate = await Category.find({delete_status: 0})

       /* TEST JOIN */

       const getJointData = await Category.aggregate([

        {
          $lookup: {
            from: "categories_types",
            localField: "category_type_id",
            foreignField: "type_id",
            as: "all_cate"
          }
        },
        {
            $unwind: "$all_cate"
        },
        {
          $lookup: {
            from: "categories_details",
            localField: "all_cate.detail_id",
            foreignField: "type_id",
            as: "details_product"
          }
        },
        {
            $unwind: "$details_product"
        },
        {
            $lookup: {
              from: "categories_vendor",
              localField: "details_product.vendor_id",
              foreignField: "vendor_id",
              as: "add_vendor"
            }
          }
          

      ]);

      const chk_kkk = await Categories_detail.aggregate([
        {
          $match: {
            type_id: {
            //   $in: [1, 3] // Array of user IDs you're interested in
            $in: [1]
            }
          }
        },
        {
          $lookup: {
            from: "categories_types",
            localField: "type_id",
            foreignField: "type_id",
            as: "product_type"
          }
        },
        {
          $unwind: "$product_type"
        },
        {
          $project: {
            _id: 1,
            name: 1,
            order: "$user_orders"
          }
        }
      ]);
      
      const getDetailsCate = await Categories_detail.aggregate([
        {
          $lookup: {
            from: "categories_types",
            localField: "type_id",
            foreignField: "type_id",
            as: "all_cate"
          }
          
        },
        {
          $unwind: "$all_cate"
        },
        {
          $lookup: {
            from: "categories",
            localField: "category_type",
            foreignField: "type_id",
            as: "all_category"
          }
        },
        {
          $unwind: "$all_category"
        }
      ]);


      console.log("getJointData", getCate)
         return res.status(200).send({message: "Get Data Success", data: getCate});
    }catch(error){
        res.status(500).send({message: "Internal Server Error"});
    }
};
module.exports.CreateCategory = async (req,res) => {
    try{
        var nameData = req.body.category_name_th;
        var nameDataEn = req.body.category_name_en;
        const getCateID = await Category.findOne().sort( { category_id : -1, posts: 1 }).limit(1) ;
        const chkName = await Category.find({category_name_th : nameData});
        if(chkName.length > 0){
            console.log("Duplicate name in the system");
            return res.status(200).send({message: "Duplicate name in the system",nameData});
        }
        const genCateID = getCateID.category_id+1;
        const data_query = {"category_id": genCateID,
                            "category_name_th": nameData,
                            "category_name_en" : nameDataEn,
                            "delete_status" : 0
                            }
        
        const create_categories = await Category.insertMany(data_query);
        return res.status(200).send({message: "Create Data Successfully",data: create_categories});
        console.log(genCateID)
        return res.status(200).send({message: "Create Data Successfully",data: getCateID});
    }catch(error){
        res.status(500).send({message: "Internal Server Error"});
    }
};

module.exports.CreateCategoryType = async (req, res) => {
    try{
        var mokup_DataTypeName = "กระดาษแข็ง";
        const chk_nameType = await Category.find({name: mokup_DataTypeName});
        if(mokup_DataTypeName.length > 0){
            console.log("Duplicate name product");
            return res.status(200).send({message: "Internal Server Error", data: mokup_DataTypeName})
        }else{
            console.log("No duplicate");

        }
    }catch(error){
        return res.status(500).send({message: "Internal Server Error"});
    }
}

module.exports.CreateType = async (req, res) => {
    try{
 
        const getCateId = req.body.category_id
        const getTypeName_th = req.body.detail_th
        const getTypeName_en = req.body.detail_en

        const chk_type_id = await Category_type.find().sort({type_id: -1}).limit(2)
        const genTypeId = parseInt(chk_type_id[0].type_id)+1 ;
        const chk_name = await Category_type.find({detail_th: getTypeName_th});
        if(chk_name.length > 0){
            console.log("ชื่อหมวดหมู่นี้ได้สร้างไปแล้ว");
            return res.status(200).send({message:"ชื่อหมวดหมู่นี้ได้สร้างไปแล้ว"});
        }else{
            let createtype = {
                type_id: genTypeId,
                detail_th: getTypeName_th,
                detail_en : getTypeName_en,
                category_id: getCateId,
                delete_status: 0
            };

            const createType = new Category_type(createtype);
            const createTypeData = await createType.save();
            console.log(chk_type_id);
            return res.status(200).send({message:"สร้างหมวดหมู่สำเร็จ",data: createtype});
        }
        
    }catch(error){
      return res.status(500).send({message: "Internal server error", error: error.message});
    }
}

module.exports.CreateDetailProduct = async (req, res) => {
  try{
    const getDetailId = await Categories_detail.find().sort({detail_id: -1}).limit(1);
    console.log("getDetailId", getDetailId)
    const genDetailId = parseInt(getDetailId[0].detail_id)+1
    const getVendorId = await Categories_vendor.find().sort({vendor_id: -1}).limit(1);
    const genVendorId = parseInt(getVendorId[0].vendor_id)+1
    var Datadetail_name_th = req.body.detail_name_th;
    const chkNameDetail = await Categories_detail.find({detail_name_th: Datadetail_name_th});
    // const getVendorId = sd;
    if (chkNameDetail.length > 0)
    // มีการใช้ชื่อนี้ไปแล้ว
    return res.status(401).send({
      message: "มีการใช้ชื่อรายการสินค้านี้ไปแล้ว",
      status: false,
    });
    // Details Data 
    const detail_name_th = req.body.detail_name_th;
    const detail_name_en = req.body.detail_name_en;
    const detail_cost = req.body.detail_cost;
    const detail_unit = req.body.detail_unit;
    const detail_type = req.body.type_id;
    const detail_cateId = req.body.category_id

    // var convert_getHours = getHours < 10 ? '0'+getHours : getHours;
  

    const class_A = req.body.price_A;
    const class_B = req.body.price_B;
    const class_C = req.body.price_C;
    const class_D = req.body.price_D;
    let DataVendor = ({
      A: [class_A],
      B: [class_B],
      C: [class_C],
      D: [class_D],
    });

    const convertDataVendortoString = JSON.stringify(DataVendor);
    console.log("convertDataVendortoString", convertDataVendortoString);

    const dataVendor = {
      vendor_id: genVendorId,
      vendor_data: convertDataVendortoString,
      remark: req.body.remark
    }
    console.log("DataVendor : ", DataVendor)
    const createVendor = new Categories_vendor(dataVendor);
    const CreateVendorData = await createVendor.save();

    let dataDetail = {
      detail_id: genDetailId,
      detail_name_th: detail_name_th,
      detail_name_en: detail_name_en,
      details_cost: detail_cost,
      detail_unit: detail_unit,
      type_id: detail_type,
      vendor_id: req.body.vendor_id,
      category_id: req.body.category_id,
      vendor_id : genVendorId,
      delete_status: 0
  }
  console.log("dataDetail : ", dataDetail)
  // console.log("genDetailId", genDetailId)
  // console.log("genVendorId", genVendorId)
  // console.log("Vendor ID : ",genVendorId)
    const createDetail = new Categories_detail(dataDetail);
    const createDetailData = await createDetail.save();

    return res.status(200).send({message: "Create Details Product Success",data: {dataDetail}})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }

}

module.exports.CreateVendor = async (req, res) => {
  try{
    var getVendor = req.body.vendor_class;
    var geRemark = req.body.remark
    const chkname = await Categories_vendor.find({vendor_class: getVendor});
    let dataVendor = {
      vendor_class: getVendor,
      vendor_cost: vendor_cost,
      remark: geRemark
    }
    if(chkname.length>0){
      return res.status(404).send({message:"Vendor นี้ถูกใช้ไปแล้ว"})
    }else{
      const createVendor = new category_vendor(dataVendor);
      const createTypeData = await createVendor.save();
    }
    
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }
}
module.exports.CateDelete = async (req, res) => {
  try{
    var id = req.body._id
        // const deleteData = await Category.findByIdAndDelete(id);
        const updateDeleteData = {
          $set: {
            delete_status: 1,
          },
        };
        
        const result = await Category.findByIdAndUpdate(id, updateDeleteData, { new: true })
        return res.status(200).send({message:"ลบสำเร็จ",data: result})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }
}

module.exports.UpdateCate = async (req, res) => {
  try{
    var getCateId = req.body._id
    // const getID = await Category.find({category_id: getCateId})
    // const genID = getID[0]._id
    // console.log(genID)
    const updateData = {
      $set: {
        category_name_th: req.body.category_name_th,
        category_name_en: req.body.category_name_en
      },
    };
    
    // const updateCate = await Category.updateOne({category_id: getCateId}, {$set:{category_name_th: getCateName_th, getCateName_en: getCateName_en}})

    const result = await Category.findByIdAndUpdate(getCateId, updateData, { new: true })
    console.log(getCateId);
      
    return res.status(200).send({message:"ทำการอัพเดทสำเร็จ"})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }
}

module.exports.GetbyId = async (req, res) => {

  try{
    const getId = await Category.find({_id:req.body._id});
    console.log(req.body)
    return res.status(200).send({message:"Get Data Success", data: getId})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }
}

module.exports.getOrderData = async (req, res) => {
  try{
    const getId = req.body.category_id;
    const getCateOrder = await Category.aggregate([
      {$match: {
        category_id: getId
      }},
      {
        $lookup: {
          from: "categories_types",
          localField: "category_id",
          foreignField: "type_id",
          as: "all_cate"
        }
      },
      {
          $unwind: "$all_cate",
      },
      {
        $lookup: {
          from: "categories_details",
          localField: "category_id",
          foreignField: "type_id",
          as: "all_details"
        }
      },
      {
        $group: {
          _id: '$_id',
          category_id: { $first: '$category_id' },
          category_name_en: { $first: '$category_name_en' },
          category_name_th: { $first: '$category_name_th' },
          all_cate: { $first: '$all_cate' },
          all_details: { $push: '$all_details' }
        }
      },
      {
        $project: {
          message: 'Get Data Success',
          getCateOrder: {
            _id: '$_id',
            category_id: '$category_id',
            category_name_en: '$category_name_en',
            category_name_th: '$category_name_th',
            all_cate: {
              _id: '$all_cate._id',
              type_id: '$all_cate.type_id',
              detail_th: '$all_cate.detail_th',
              detail_en: '$all_cate.detail_en',
              category_id: '$all_cate.category_id',
              detail_data: '$all_details',
              __v: '$all_cate.__v'
            },
            all_details: 1
          }
        }
      }
    ]);
    return res.status(200).send({message:"Get Data Success", getCateOrder})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }
}
module.exports.getDetailVendor = async (req,res) => {
  try{
    var getId = req.body.detail_id
    var getClass = req.body.class
    const chkData = await Categories_detail.aggregate([
      {$match: {
        vendor_id: getId
      }},
      {
        $lookup: {
          from: "categories_vendors",
          localField: "vendor_id",
          foreignField: "vendor_id",
          as: "vendorPrice"
        }
      },
])

      // const vendorData = JSON.parse(chkData[0].vendorPrice[0].vendor_data);
      console.log("chkData", chkData)
      const vendorData = chkData[0].vendorPrice
      console.log("getId", getId)
      console.log("Data 1 : ", vendorData[0]['vendor_data'])
      var stringtoarray = JSON.parse(vendorData[0]['vendor_data'])
      console.log("Data 2 : ",JSON.stringify(stringtoarray.A[0]))
      if(getClass == "A" ){
        var venData = stringtoarray.A[0]
      }else if(getClass == "B" ){
        var venData = stringtoarray.B[0]
      }else if(getClass == "C"){
        var venData = stringtoarray.C[0]
      }else{
        var venData = stringtoarray.D[0]
      }
      const valueForA = venData;
      console.log(valueForA)

      return res.status(200).send({message:"aaaaa", data: valueForA})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message})
  }
}

module.exports.GetType = async (req,res) => {
  try{
    const GetTypeData = await Category_type.find({delete_status: 0})
    return res.status(200).send({message:"Get type Susecc", data: GetTypeData})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message})
  }
}

module.exports.UpdateType = async (req, res) => {
  try{
    var getId = req.body._id
    var get_name_th = req.body.detail_th
    var get_name_en = req.body.detail_en
    const chk_name = await Category_type.find({detail_th: get_name_th});
    if (chk_name.length > 0)
    // มีการใช้ชื่อนี้ไปแล้ว
    return res.status(401).send({
      message: "มีประเภทสินค้านี้ในระบบแล้ว",
      status: false,
    });
    const updateData = {
      $set: {
        detail_th: req.body.detail_th,
        detail_en: req.body.detail_en
      },
    };
    const result = await Category_type.findByIdAndUpdate(getId, updateData, { new: true })
    return res.status(200).send({message:"Update type Sucsess", data: result})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message})
  }
}
module.exports.deleteType = async(req, res)=>{
  try{
      const id = req.body._id;
      // const delete_type = await Category_type.findByIdAndDelete(id);
      const updateData = {
        $set: {
          delete_status: 1,
        },
      };
      const result = await Category_type.findByIdAndUpdate(id, updateData, { new: true })
      if(result){
          return res.status(200).send({message: "ลบข้อมูลสำเร็จ", status: true, updateData});
      }else{
          return res.status(400).send({status: false, message : "ลบข้อมูลไม่สำเร็จ"})
      }
  }catch(err){
      console.log(err);
      return res.status(400).send({message: err._message});
  }
}

module.exports.getDetailByID = async (req, res) => {
  try{
    var getTypeID = req.body.type_id
    const GetDetailData = await Category_type.aggregate([
      {
        $match: {
          type_id: getTypeID,
          delete_status: 0
        }
      },
      {
        $lookup: {
          from: "categories_details",
          localField: "type_id",
          foreignField: "type_id",
          as: "all_cate"
        }
      },
      {
        $unwind: "$all_cate" // Unwind the array to access nested documents
      },
      {
        $match: {
          "all_cate.delete_status": 0
        }
      },
    {
      $group:{
        _id: '$_id',
        category_id: { $first: '$type_id' },
        category_name_en: { $first: '$detail_th' },
        category_name_th: { $first: '$detail_en' },
        all_cate: {$push: '$all_cate'}
      }
    }
    ])
    console.log("getTypeID", getTypeID)
    console.log("getTypeByID", GetDetailData)
    return res.status(200).send({message:"Get type By ID Sucsess", data: GetDetailData})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message})
  }
}

module.exports.GetTypeByID = async (req, res) => {
  try{
    const getTypeID = req.body.type_id
    const GetTypeData = await Category_type.aggregate([
      {
        $match: {
          type_id: getTypeID,
          delete_status: 0
        }
      },
      {
        $lookup: {
          from: "categories_details",
          localField: "type_id",
          foreignField: "type_id",
          as: "all_cate"
        }
      },
      {
        $unwind: "$all_cate" // Unwind the array to access nested documents
      },
      {
        $match: {
          "all_cate.delete_status": 0
        }
      },
    {
      $group:{
        _id: '$_id',
        category_id: { $first: '$type_id' },
        category_name_en: { $first: '$detail_th' },
        category_name_th: { $first: '$detail_en' },
        all_cate: {$push: '$all_cate'}
      }
    }
    ])

    
    console.log("getTypeByID >>>> ", GetTypeData)
    console.log("req.body.type_id : ", req.body.type_id)

    return res.status(200).send({message:"Get type By ID Sucsess", data: GetTypeData})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message})
  }
}

module.exports.getVendorByID = async (req, res) => {
  try{
    var getId = req.body.detail_id
    const getTypeByID = await category_detail.aggregate([
      {
        $match: {
          detail_id: getId,
          delete_status: 0
        }
      },
      {
        $lookup: {
          from: "categories_vendors",
          localField: "detail_id",
          foreignField: "vendor_id",
          as: "all_details"
        }
      }
    ])
    console.log("chkdata")
    console.log("getTypeByID", getTypeByID)
    return res.status(200).send({message:"Get type By ID Sucsess", data: getTypeByID})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message})
  }
}

module.exports.GetCateByID = async (req,res) => {
  try{
    var cateId = req.body.category_id
    const getCateData = await Category.aggregate([
      {
        $match: {
          category_id: cateId,
          delete_status: 0
        }
      },
      {
        $lookup: {
          from: "categories_types",
          localField: "category_id",
          foreignField: "category_id",
          as: "all_category"
        }
      },
      {
        $unwind: "$all_category" // Unwind the array to access nested documents
      },
      {
        $match: {
          "all_category.delete_status": 0
        }
      },
      {
        $group:{
          _id: '$_id',
          category_id: { $first: '$category_id' },
          category_name_en: { $first: '$category_name_th' },
          category_name_th: { $first: '$category_name_en' },
          all_cate: {$push: '$all_category'}
        }
      }
    ])

    const chkdata = await Category.aggregate([
      {
        $lookup: {
          from: "categories_types",
          localField: "category_id",
          foreignField: "type_id",
          as: "all_category"
        }
      },
      {
        $unwind: "$all_category" // Unwind the array to access nested documents
      }

    ])

    // const getCate = await Category.find()

    // console.log("getCate", getCate)

    // console.log("chkdata", chkdata)
    // console.log("cateId : ", cateId)
    console.log("getCateData : ", getCateData)
    return res.status(200).send({message: "Get Cateory By ID Success",data: getCateData})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message})
  }
}

module.exports.CheckData = async (req, res) => {
  try{
    var getId = 1
    const getTypeData = await Category.aggregate([
      {$match: {
        category_id: getId
      }},
      {
        $lookup: {
          from: "categories_types",
          localField: "category_id",
          foreignField: "type_id",
          as: "all_cate"
        }
      },
      {
          $unwind: "$all_cate",
      },
      {
        $group: {
          _id: '$_id',
          category_id: { $first: '$category_id' },
          category_name_en: { $first: '$category_name_en' },
          category_name_th: { $first: '$category_name_th' },
          all_cate: { $first: '$all_cate' },
        }
      },
      {
        $project: {
          message: 'Get Data Success',
          getCateOrder: {
            _id: '$_id',
            category_id: '$category_id',
            category_name_en: '$category_name_en',
            category_name_th: '$category_name_th',
            all_cate: {
              _id: '$all_cate._id',
              type_id: '$all_cate.type_id',
              detail_th: '$all_cate.detail_th',
              detail_en: '$all_cate.detail_en',
              category_id: '$all_cate.category_id',
              __v: '$all_cate.__v'
            },
            // all_details: 1
          }
        }
      }
    ]);
    const getTypeID = req.body.type_id
    const chk_data = await Category_type.aggregate([
      {
        $match: {
          type_id: getTypeID,
          delete_status: 0
        }
      },
      {
        $lookup: {
          from: "categories_details",
          localField: "type_id",
          foreignField: "type_id",
          as: "all_cate"
        }
      },
      {
        $unwind: "$all_cate" // Unwind the array to access nested documents
      },
      {
        $match: {
          "all_cate.delete_status": 0
        }
      },
    {
      $group:{
        _id: '$_id',
        category_id: { $first: '$type_id' },
        category_name_en: { $first: '$detail_th' },
        category_name_th: { $first: '$detail_en' },
        all_cate: {$push: '$all_cate'}
      }
    }
    ])
    const getCateData = await Category.aggregate([
      {
        $match: {
          category_id: getTypeID,
          delete_status: 0
        }
      },
      {
        $lookup: {
          from: "categories_types",
          localField: "category_id",
          foreignField: "category_id",
          as: "all_category"
        }
      },
      {
        $unwind: "$all_category" // Unwind the array to access nested documents
      },
      {
        $match: {
          "all_category.delete_status": 0
        }
      },
      {
        $group:{
          _id: '$_id',
          category_id: { $first: '$category_id' },
          category_name_en: { $first: '$category_name_th' },
          category_name_th: { $first: '$category_name_en' },
          all_cate: {$push: '$all_category'}
        }
      }
    ])
    // console.log("getTypeData", getTypeData)
    console.log("getCateData", getCateData)
    return res.status(200).send({message: "Checkdata", data: getCateData})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message})
  }
}

module.exports.DeleteDetail = async (req,res) => {
  try{
    var id = req.body.detail_id
    const updateDeleteData = {
      $set: {
        delete_status: 1,
      },
    };
    
    const result = await Categories_detail.findByIdAndUpdate(id, updateDeleteData, { new: true })
    return res.status(200).send({message:"Delete Details Success",data: result})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message})
  }
}
module.exports.UpdateDetail = async (req,res) => {
  try{
    var id = req.body._id
    var getDataDetail = await Categories_detail.findOne({_id: id})
    const chk_name = await Categories_detail.find({detail_name_th: req.body.detail_name_th});
    if (chk_name.length > 0)
    // มีการใช้ชื่อนี้ไปแล้ว
    return res.status(401).send({
      message: "มีชื่อรายละเอียดสินค้านี้ในระบบแล้ว",
      status: false,
    });
    let detailData = {
      $set:{
        detail_name_th: req.body.detail_name_th ? req.body.detail_name_th: getDataDetail.detail_name_th,
        detail_name_en: req.body.detail_name_en ? req.body.detail_name_en: getDataDetail.detail_name_en,
      }
    }

    const result = await Categories_detail.findByIdAndUpdate(id, detailData, { new: true })
    console.log("id : ", id);
    console.log("result : ", result);
    return res.status(200).send({message:"Update Details Success",data: result})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message})
  }
}

module.exports.UpdateVendor = async (req,res) => {
  try{
    var id = req.body.vendor_id
    var getDataVendor = await Categories_vendor.findOne({vendor_id: id})
    let vendorData = {
      $set:{
        vendor_data: req.body.vendor_data ? req.body.vendor_data: getDataVendor.vendor_data,

      }
    }
    const vendor_query = await category_vendor.updateOne({vendor_id: id}, vendorData)
    // const result = await Categories_vendor.findByIdAndUpdate(id, vendorData, { new: true })
    console.log("id : ", id);
    console.log("vendor_query : ", vendor_query);
    return res.status(200).send({message:"Update Vendor Success",data: vendor_query})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message})
  }
}



