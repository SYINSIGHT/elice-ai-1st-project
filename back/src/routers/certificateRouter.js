import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { certificateService } from "../services/certificateService";

const certificateRouter = Router();

certificateRouter.post(
    "/certificate/create",
    login_required,
    async (req, res, next) => {
        try {
            //토큰으로 사용자 id 불러오기
            const user_id = req.currentUserId

            if (is.emptyObject(req.body)) {
                throw new Error(
                  "headers의 Content-Type을 application/json으로 설정해주세요"
                );
              }
            // req 에서 데이터 가져오기  
            const name = req.body.name;
            const description = req.body.description;

            //데이터를 학력 DB에 추가하기
            const newCertificate = await certificateService.addCertificate({
                user_id,
                name,
                description,
            });

            if (newCertificate.errorMessage) {
                throw new Error(newCertificate.errorMessage);
            }

            res.status(201).json(newCertificate);
        } catch (error) {
            next(error);
        }
    }
);

certificateRouter.get(
    '/certificates/:id',
    login_required,
    async (req, res, next) => {
        try {
            const _id = req.params.id;
            const certificate = await certificateService.getCertificate({ _id });

            res.status(200).json(certificate);
        } catch (error) {
            next(error);
        }
    }
);

certificateRouter.put(
    '/certificates/:id',
    login_required,
    async (req, res, next) => {
        try {
            // URI로부터 id를 추출함.
            const _id = req.params.id;
            // body data 로부터 업데이트할 학력 정보를 추출함.
            const name = req.body.name ?? null;
            const description = req.body.description ?? null;
            
            const toUpdate = { name, description };

            //해당 id로 학력 정보를 db에서 찾아 업데이트함. 업데이트가 없을 시 생략
            const updatedCertificate = await certificateService.setCertificate({_id, toUpdate});

            if(updatedCertificate.errorMessage) {
                throw new Error(updatedCertificate.errorMessage);
            }

            res.status(200).json(updatedCertificate);
        } catch (error) {
            next(error);
        }
    }
);

//삭제 기능 추가
certificateRouter.delete(
    '/certificates/:id',
    login_required,
    async (req, res, next) => {
        try {
            const result = await certificateService.removeCertificate({ _id: req.params.id });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

certificateRouter.get(
    '/certificatelist/:user_id',
    login_required,
    async (req, res, next) => {
        try {
            // URI로부터 user_id를 추출함.
            const user_id = req.params.user_id;
            const certificates = await certificateService.getCertificates({ user_id });

            res.status(200).json(certificates);
        } catch (error) {
            next(error);
        }
    }
);


export { certificateRouter };
