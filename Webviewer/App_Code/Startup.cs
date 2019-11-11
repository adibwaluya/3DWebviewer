using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Webviewer.Startup))]
namespace Webviewer
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}
