import { UserStatus } from "@prisma/client";
import { CreateNotificationsForAnyUserDto } from "src/modules/entities/notificatations/dto/notification.dto";
import { NotificationService } from "src/modules/entities/notificatations/notification.service";

type AccountStatus = "ACTIVE" | "BANNED";

type UpdateAccountStatusFn<T> = (id: string, status: UserStatus) => Promise<T>;

type AccountStatusActionOptions<T> = {
    id: string;
    notificationService: NotificationService;
    updateAccountStatus: UpdateAccountStatusFn<T>;
};

const accountStatusNotifications: Record<AccountStatus, Omit<CreateNotificationsForAnyUserDto, "userIds">> = {
    [UserStatus.ACTIVE]: {
        title: "Ваша заявка на участие в Клубе Строителей Сколково была одобрена",
        text: "Поздравляем! Ваша заявка на участие в Клубе Строителей Сколково была одобрена. Вы можете начать использовать все возможности нашего сервиса."
    },
    [UserStatus.BANNED]: {
        title: "Ваша заявка на участие в Клубе Строителей Сколково была отклонена",
        text: "Мы сожалеем, но ваша заявка на участие в Клубе Строителей Сколково была отклонена."
    }
};

const notifyAndUpdateAccountStatus = async <T> (
    id: string,
    status: AccountStatus,
    notificationService: NotificationService,
    updateAccountStatus: UpdateAccountStatusFn<T>
): Promise<T> => {
    const notification = accountStatusNotifications[status];

    await notificationService.createNotificationsForAnyUser({
        ...notification,
        userIds: [id]
    });

    return await updateAccountStatus(id, status);
};

export const applyAccount = async <T> (options: AccountStatusActionOptions<T>): Promise<T> => {
    return await notifyAndUpdateAccountStatus(
        options.id,
        UserStatus.ACTIVE,
        options.notificationService,
        options.updateAccountStatus
    );
};

export const banAccount = async <T> (options: AccountStatusActionOptions<T>): Promise<T> => {
    return await notifyAndUpdateAccountStatus(
        options.id,
        UserStatus.BANNED,
        options.notificationService,
        options.updateAccountStatus
    );
};
