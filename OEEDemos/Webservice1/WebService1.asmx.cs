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
            List<User> list = new List<User>() {
                new User { id=1, parent=0, text="item1", name="abc" },
                new User { id=2, parent=0, text="item2", name="abc" },
                new User { id=5, parent=1, text="item1.1", name="abc" },
                new User { id=14, parent=6, text="item1.2.1", name="abc" },
                new User { id=9, parent=2, text="item2.2" },
                new User { id=3, parent=0, text="item3" },
                new User { id=13, parent=5, text="item1.1.1" },
                new User { id=4, parent=0, text="item4" },         
                new User { id=6, parent=1, text="item1.2" },
                new User { id=7, parent=1, text="item1.3" },
                new User { id=8, parent=2, text="item2.1" },        
                new User { id=10, parent=3, text="item3.1" },
                new User { id=11, parent=3, text="item3.2" },
                new User { id=12, parent=4, text="item4.1" }
            };    
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
        public int id { get; set; }
        public int parent { get; set; }
        public string text { get; set; }                       
       public string name { get; set; }
    }
}
