using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;

namespace Webservice1
{
    /// <summary>
    /// Summary description for WebService1
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class WebService1 : System.Web.Services.WebService
    {

        [WebMethod]
        [ScriptMethod(UseHttpGet =true)]
        public string HelloWorld()
        {
            User use1 = new User
            {
                ID = 1,
                Name = "GXW",
                PWD = "123456"
            };

            User use2 = new User
            {
                ID = 2,
                Name = "GXW2",
                PWD = "23456"
            };

            User use3 = new User
            {
                ID = 3,
                Name = "3GXW2",
                PWD = "3456"
            };
            List<User> list = new List<User>();
            list.Add(use1);
            list.Add(use2);
            list.Add(use3);
            return ToJSON(list);
        }

        //对数据序列化，返回JSON格式 
        public string ToJSON(object obj)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            return serializer.Serialize(obj);
        }
    }

    public class User
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string PWD { get; set; }
    }
}
