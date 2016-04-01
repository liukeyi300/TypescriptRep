
module AicTech.Web.Utils {
    interface IPromise<T> extends JQueryPromise<T> { }
    /**
     * 未完成！！！！
     * 请勿使用！！！
     */
    class AsyncUtils {
        static createDeferred() {
            return $.Deferred();
        }

        static createPromise() {
            return $.Deferred().promise();
        }
    }
}