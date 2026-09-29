import {
    updateIndentStatus
} from "../../../services/purchaseService";

export default function useIndentStatus(load, detail, setDetail, setNotice) {

    function badge(status) {

        switch (status) {

            case "Draft":
                return "secondary";

            case "Submitted":
                return "primary";

            case "Approved":
                return "success";

            case "Cancelled":
                return "danger";

            default:
                return "secondary";

        }

    }

    async function changeStatus(id, status) {

        try {

            await updateIndentStatus(

                id,

                status

            );

            if (load)

                await load();

            if (

                detail &&

                detail.IndentID === id

            ) {

                setDetail({

                    ...detail,

                    Status: status

                });

            }

            if (setNotice) {

                setNotice(

                    `Indent ${status.toLowerCase()}.`

                );

            }

        }

        catch (err) {

            console.error(err);

            if (setNotice) {

                setNotice(

                    "Unable to update status."

                );

            }

        }

    }

    return {

        badge,

        changeStatus

    };

}