package com.event.event_management.util;
import java.io.ByteArrayOutputStream;
import java.util.Base64;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
public class QRCodeGenerator {
	 public static String generateQRCode(String text) throws Exception {

	        QRCodeWriter qrCodeWriter = new QRCodeWriter();
	        BitMatrix bitMatrix = qrCodeWriter.encode(
	                text,
	                BarcodeFormat.QR_CODE,
	                250,
	                250
	        );

	        BufferedImage bufferedImage = new BufferedImage(
	                250,
	                250,
	                BufferedImage.TYPE_INT_RGB
	        );

	        for (int x = 0; x < 250; x++) {
	            for (int y = 0; y < 250; y++) {
	                bufferedImage.setRGB(
	                        x,
	                        y,
	                        bitMatrix.get(x, y) ? 0x000000 : 0xFFFFFF
	                );
	            }
	        }

	        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
	        ImageIO.write(bufferedImage, "png", outputStream);

	        return Base64.getEncoder()
	                .encodeToString(outputStream.toByteArray());
	    }
}
