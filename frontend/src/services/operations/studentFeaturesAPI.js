import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API } = studentEndpoints;

function loadScript(src) {
    if (window.Razorpay) return Promise.resolve(true);

    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => {
            script.remove();
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading...");
    try {
        const scriptLoaded = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );
        if (!scriptLoaded) {
            throw new Error("Razorpay Checkout could not be loaded");
        }

        const orderResponse = await apiConnector(
            "POST",
            COURSE_PAYMENT_API,
            { courses },
            { Authorization: `Bearer ${token}` }
        );
        const order = orderResponse.data.data;
        if (!orderResponse.data.success || !order?.orderId || !order?.keyId) {
            throw new Error(
                orderResponse.data.message || "Could not create payment order"
            );
        }

        const paymentObject = new window.Razorpay({
            key: order.keyId,
            currency: order.currency,
            amount: order.amount,
            order_id: order.orderId,
            name: "StudyNotion",
            description: "Thank You for Purchasing the Course",
            image: rzpLogo,
            prefill: {
                name: `${userDetails?.firstName || ""} ${userDetails?.lastName || ""}`.trim(),
                email: userDetails?.email || "",
            },
            handler: (response) =>
                verifyPayment(response, token, navigate, dispatch),
        });

        paymentObject.on("payment.failed", (response) => {
            toast.error(response.error?.description || "Payment failed");
        });
        paymentObject.open();
    } catch (error) {
        console.error("Could not start course payment:", error);
        toast.error(
            error.response?.data?.message ||
                error.message ||
                "Could not make payment"
        );
    } finally {
        toast.dismiss(toastId);
    }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try {
        const response = await apiConnector(
            "POST",
            COURSE_VERIFY_API,
            bodyData,
            { Authorization: `Bearer ${token}` }
        );
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("Payment successful. You are enrolled in the course.");
        dispatch(resetCart());
        navigate("/dashboard/enrolled-courses");
    } catch (error) {
        console.error("Could not verify course payment:", error);
        toast.error(
            error.response?.data?.message ||
                error.message ||
                "Could not verify payment"
        );
    } finally {
        toast.dismiss(toastId);
        dispatch(setPaymentLoading(false));
    }
}
