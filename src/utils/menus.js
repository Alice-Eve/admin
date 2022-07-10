import {getRequest} from "@/utils/api";
import Home from "@/views/Home";


export const initMenu = (router, store) =>{
    if (store.state.menus.length > 0) {
        return;
    }
    getRequest("/system/menu/").then(data=>{if (data) {
            let fmtRoutes = formatRoutes(data);
            router.addRoutes(fmtRoutes)
            store.commit("initMenus", formatsRoutes(data));
        }
    })
}
//获取菜单栏
export const formatsRoutes=(routes) =>{
    let fmsRoutes = [];
    routes.forEach(router => {
        if (router.url != null) {
            let {
                path,
                name,
                icon,
                children
            } = router;
            if (children && children instanceof Array) {
                children = formatRoutes(children);
            }
            let fmeRoutes = {
                path: path,
                name: name,
                icon: icon,
                children: children,
            }
            fmsRoutes.push(fmeRoutes);
        } else {
            router.children.forEach(r=>{
                if (r.path != null) {
                    let fmeRoutes ={
                            path: r.path,
                            name: r.name,
                            icon: r.icon,
                    }
                    fmsRoutes.push(fmeRoutes)
                }
            })
        }
    })
    return fmsRoutes;
}
//获取二级路由
export const formatRoutes=(routes) =>{
    let fmRoutes = [];
    routes.forEach(router => {
        if (router.path) {
            let {
                path,
                component,
                name,
                icon,
                children
            } = router;
            if (children && children instanceof Array) {
                children = formatRoutes(children);
            }
            let fmRouter = {
                path: path,
                name: name,
                icon: icon,
                children: children,
                component(resolve) {
                    if (component.startsWith("Home")) {
                        require(['../views/'+component+".vue"],resolve);
                    } else {
                        require(['../views/'+component],resolve);
                    }
                }
            }
            fmRoutes.push(fmRouter);
        }
    })
    return fmRoutes;
}
