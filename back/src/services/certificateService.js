import { Certificate } from '../db'
class certificateService {
    static addCertificate = async ({ user_id, name, description }) => {
        const newCertificate = { user_id, name, description };
        
        const createdNewCertificate = await Certificate.create({ newCertificate });
        createdNewCertificate.errorMessage = null;

        return createdNewCertificate;
    };

    static getCertificates = async ({ user_id }) => {
        const Certificates = await Certificate.findByUserId({ user_id });
        return Certificates;
    }

    static getCertificate = async ({ _id }) => {
        const certificate = await Certificate.findById({ _id });
        
        // db에 없는 경우, 에러 메시지 반환
        if (!certificate) {
            const errorMessage = "_id에 해당하는 데이터가 없습니다."
            return errorMessage;
        }

        const name = certificate.name;
        const description = certificate.description;

        const clickedCertificate = {
            name,
            description,
        }
        return clickedCertificate
    };

    static setCertificate = async ({ _id, toUpdate }) => {
        //우선 해당 id의 학력이 db에 존재하는지 확인
        let certificate = await Certificate.findById({ _id });

        // db에 없는 경우, 에러 메시지 반환
        if (!certificate) {
            const errorMessage = "_id에 해당하는 데이터가 없습니다."
            return errorMessage;
        }

        if (toUpdate.name) {
            const fieldToUpdate = "name";
            const newValue = toUpdate.name;
            certificate = await Certificate.update({_id, fieldToUpdate, newValue})
        }
        if (toUpdate.description) {
        const fieldToUpdate = "description";
            const newValue = toUpdate.description;
            certificate = await Certificate.update({_id, fieldToUpdate, newValue})
        }

        return certificate;
    };

    static removeCertificate = async ({ _id }) => {
        const result = await Certificate.remove({ _id });
        return result;
    }
};

export { certificateService };
