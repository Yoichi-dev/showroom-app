import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";

UIkit.use(Icons);

export default (ctx, inject) => {
  ctx.$UIkit = UIkit;
  inject("UIkit", UIkit);
};
