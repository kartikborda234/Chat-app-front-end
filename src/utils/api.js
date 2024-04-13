const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
};

const user = JSON.parse(localStorage.getItem("loginUser"));
export const fetchApi = async (
    url,
    params={},
    headers = {},
    token
) => {
    let data = await fetch(url,{...params,headers:{
            Accept: "application/json",
            "Content-Type": "application/json",
            accessToken: localStorage.getItem("accessToken"),
            Authorization:token,
            ...headers}
    }).then((res) => {
        if(res.status === 401){
            handleLogOut();
        }
        else if(res.ok){
            return res.json();
        }
    });
    return data;
};