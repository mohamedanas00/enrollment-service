import CircuitBreaker from "opossum";
import axios from "axios";

async function UpdateEnrollmentCount(courseId) {
  try {
    console.log("Check", courseId);
    await axios.patch(
      `http://localhost:${process.env.COURSE_SERVICE_PORT}/course/UpdateEnrollCourse/${courseId}`
    );
    return true;
  } catch (error) {
    if (error.response) {
      return error.response.data.message;
    }
    throw error;
  }
}

const options = {
  timeout: 3000, //*If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 100, //*This doesn't affect the fixed number of failed requests
  resetTimeout: 10000, //*After 10 seconds, try again.
};

const failedRequestsThreshold = 3; //*FIXED NUMBER OF FAILED REQUESTS

const breaker = new CircuitBreaker(UpdateEnrollmentCount, options);

let failedRequestsCount = 0; //*Counter to track the number of failed requests

export async function UpdateEnrollmentCountWithCircuitBreaker(courseId) {
  try {
    //*Call checkEnrollment function via CircuitBreaker
    const result = await breaker.fire(courseId);
    //*If request succeeded, reset failed requests count
    failedRequestsCount = 0;
    return result;
  } catch (error) {
    //*Increment failed requests count
    failedRequestsCount++;
    //!If the number of failed requests exceeds the threshold, trigger the circuit
    if (failedRequestsCount >= failedRequestsThreshold) {
      breaker.open();
    }
    return error.message;
  }
}
