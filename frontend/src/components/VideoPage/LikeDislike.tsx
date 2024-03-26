import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";


function LikeDislike({ like, dislike, Id, isDisLiked, isLiked, likeFunc, disLikeFunc }: { like: number, dislike: number, Id: string, isLiked: boolean, isDisLiked: boolean, likeFunc: any, disLikeFunc: any }) {

    const [liked, setLiked] = useState(isLiked);
    const [disliked, setDisliked] = useState(isDisLiked);
    const [likeDislikeCount, setLikeDislikeCount] = useState({ like, dislike });
    const navigate = useNavigate();
    const location = useLocation();
    const likeHandler = async () => {
        await likeFunc(Id)
            .then((response) => {
                setLiked(!liked);
                if (response.status === "addLiked" && dislike) {
                    setLikeDislikeCount({ like: likeDislikeCount.like + 1, dislike: likeDislikeCount.dislike - 1 });
                    setDisliked(!disliked);
                }
                else if (response.status === "removeLiked") setLikeDislikeCount({ like: likeDislikeCount.like - 1, dislike: likeDislikeCount.dislike });
                else if (response.status === "addLiked") setLikeDislikeCount({ like: likeDislikeCount.like + 1, dislike: likeDislikeCount.dislike });
            })
            .catch((error) => {
                if (error === "jwt expired" || error === "unauthorized request.") {
                    navigate("/login-window", { state: { from: location }, replace: true });
                }
            });
    };

    const dislikeHandler = async () => {
        await disLikeFunc(Id)
            .then((response) => {
                setDisliked(!disliked);
                if (response.status === "addDisliked" && liked) {
                    setLikeDislikeCount({ like: likeDislikeCount.like - 1, dislike: likeDislikeCount.dislike + 1 });
                    setLiked(!liked);
                }
                else if (response.status === "removeDisliked") setLikeDislikeCount({ like: likeDislikeCount.like, dislike: likeDislikeCount.dislike - 1 });
                else if (response.status === "addDisliked") setLikeDislikeCount({ like: likeDislikeCount.like, dislike: likeDislikeCount.dislike + 1 });
            })
            .catch((error) => {
                if (error === "jwt expired" || error === "unauthorized request.") {
                    navigate("/login-window", { state: { from: location }, replace: true });
                }
            });
    };

    return (
        <>
            <div className="flex flex-col items-center">
                <button className="flex flex-col items-center" onClick={likeHandler}>
                    {liked ? <IonIcon name="heart" /> : <IonIcon name="heart-outline" />}
                </button>
                <span className="text-[15px]">{likeDislikeCount.like}</span>
            </div>
            <div className="flex flex-col items-center">
                <button className="flex flex-col items-center" onClick={dislikeHandler}>
                    {disliked ? <IonIcon name="heart-dislike" /> : <IonIcon name="heart-dislike-outline" />}
                </button>
                <span className="text-[15px]">{likeDislikeCount.dislike}</span>
            </div>
        </>
    );
}

export default LikeDislike;