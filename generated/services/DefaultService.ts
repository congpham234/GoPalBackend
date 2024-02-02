/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* eslint-disable */
import type { Delivery } from '../models/Delivery';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * @returns Delivery Successful response
     * @throws ApiError
     */
    public static getV1Delivery(): CancelablePromise<Delivery> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/delivery',
        });
    }
    /**
     * @param requestBody
     * @returns any Successful response
     * @throws ApiError
     */
    public static postV1Delivery(
        requestBody?: Delivery,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/delivery',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
