import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule);
    
    const swaggerConfig = new DocumentBuilder()
        .setTitle('Документация API к программе КЛУБ СТРОИТЕЛЕЙ СКОЛКОВО')
        .setDescription('Здесь будет описанно подключение API маршрутов, их типы, схемы, ответы сервера и тд')
        .setVersion('1.0')
        .addServer('http://127.0.0.1:3000/server-api/v1')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
            'access-token'
        )
        .build()
    
    const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig, { ignoreGlobalPrefix: true });
    
    SwaggerModule.setup('docs', app, documentFactory);
    
    app.setGlobalPrefix('server-api/v1');
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }))

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();