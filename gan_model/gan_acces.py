import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
import matplotlib.pyplot as plt
import sys
import os

# Define the Generator architecture (same as in your notebook)
class ResidualBlock(nn.Module):
    def __init__(self, channels):
        super(ResidualBlock, self).__init__()
        self.block = nn.Sequential(
            nn.ReflectionPad2d(1),
            nn.Conv2d(channels, channels, kernel_size=3, padding=0),
            nn.InstanceNorm2d(channels),
            nn.ReLU(inplace=True),
            nn.ReflectionPad2d(1),
            nn.Conv2d(channels, channels, kernel_size=3, padding=0),
            nn.InstanceNorm2d(channels)
        )
    
    def forward(self, x):
        return x + self.block(x)

class Generator(nn.Module):
    def __init__(self, in_channels=3, out_channels=3, ngf=64):
        super(Generator, self).__init__()
        
        # Encoder (downsampling)
        self.down1 = nn.Sequential(
            nn.Conv2d(in_channels, ngf, kernel_size=4, stride=2, padding=1),
            nn.LeakyReLU(0.2, inplace=True)
        )
        
        self.down2 = nn.Sequential(
            nn.Conv2d(ngf, ngf * 2, kernel_size=4, stride=2, padding=1),
            nn.InstanceNorm2d(ngf * 2),
            nn.LeakyReLU(0.2, inplace=True)
        )
        
        self.down3 = nn.Sequential(
            nn.Conv2d(ngf * 2, ngf * 4, kernel_size=4, stride=2, padding=1),
            nn.InstanceNorm2d(ngf * 4),
            nn.LeakyReLU(0.2, inplace=True)
        )
        
        self.down4 = nn.Sequential(
            nn.Conv2d(ngf * 4, ngf * 8, kernel_size=4, stride=2, padding=1),
            nn.InstanceNorm2d(ngf * 8),
            nn.LeakyReLU(0.2, inplace=True)
        )
        
        # Bottleneck (residual blocks)
        self.res_blocks = nn.Sequential(
            ResidualBlock(ngf * 8),
            ResidualBlock(ngf * 8),
            ResidualBlock(ngf * 8),
            ResidualBlock(ngf * 8),
            ResidualBlock(ngf * 8)
        )
        
        # Decoder (upsampling)
        self.up1 = nn.Sequential(
            nn.ConvTranspose2d(ngf * 8, ngf * 4, kernel_size=4, stride=2, padding=1),
            nn.InstanceNorm2d(ngf * 4),
            nn.ReLU(inplace=True)
        )
        
        self.up2 = nn.Sequential(
            nn.ConvTranspose2d(ngf * 8, ngf * 2, kernel_size=4, stride=2, padding=1),
            nn.InstanceNorm2d(ngf * 2),
            nn.ReLU(inplace=True)
        )
        
        self.up3 = nn.Sequential(
            nn.ConvTranspose2d(ngf * 4, ngf, kernel_size=4, stride=2, padding=1),
            nn.InstanceNorm2d(ngf),
            nn.ReLU(inplace=True)
        )
        
        self.up4 = nn.Sequential(
            nn.ConvTranspose2d(ngf * 2, out_channels, kernel_size=4, stride=2, padding=1),
            nn.Tanh()
        )
        
    def forward(self, x):
        # Encoder
        d1 = self.down1(x)
        d2 = self.down2(d1)
        d3 = self.down3(d2)
        d4 = self.down4(d3)
        
        # Bottleneck
        out = self.res_blocks(d4)
        
        # Decoder with skip connections (UNet style)
        u1 = self.up1(out)
        u1 = torch.cat([u1, d3], dim=1)
        
        u2 = self.up2(u1)
        u2 = torch.cat([u2, d2], dim=1)
        
        u3 = self.up3(u2)
        u3 = torch.cat([u3, d1], dim=1)
        
        return self.up4(u3)

def generate_and_save_image(sketch_path, output_path, model_path='model_epoch_100.pth'):
    # Get the current directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Create absolute path to the model
    model_path = os.path.join(script_dir, model_path)
    
    # Check if the model file exists
    if not os.path.isfile(model_path):
        print(f"Error: Model file not found at {model_path}")
        return False
    
    # Set up device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    try:
        # Load the model
        checkpoint = torch.load(model_path, map_location=device)
        
        # Initialize generator
        G_sketch_to_real = Generator().to(device)
        G_sketch_to_real.load_state_dict(checkpoint['G_sketch_to_real'])
        G_sketch_to_real.eval()
        print("Model loaded successfully")
        
        # Image transformation
        transform = transforms.Compose([
            transforms.Resize((128, 128)),
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
        ])
        
        # Load and preprocess sketch
        sketch = Image.open(sketch_path).convert('RGB')
        sketch_tensor = transform(sketch).unsqueeze(0).to(device)
        print(f"Sketch loaded from {sketch_path}")
        
        # Generate image
        with torch.no_grad():
            generated_image = G_sketch_to_real(sketch_tensor)
            print("Image generation complete")
        
        # Convert to PIL image
        generated_image = (generated_image.squeeze().cpu().detach() * 0.5 + 0.5).clamp(0, 1)
        generated_image = generated_image.permute(1, 2, 0).numpy()
        
        # Convert numpy array to PIL image and save
        pil_image = Image.fromarray((generated_image * 255).astype('uint8'))
        pil_image.save(output_path)
        print(f"Generated image saved to {output_path}")
        
        return True
    except Exception as e:
        print(f"Error generating image: {str(e)}")
        return False

# Main execution if script is run directly
if __name__ == "__main__":
    # Check if the correct number of command-line arguments is provided
    if len(sys.argv) < 3:
        print("Usage: python gan_acces.py <input_sketch_path> <output_image_path> [model_path]")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    # Optional model path argument
    model_path = sys.argv[3] if len(sys.argv) > 3 else 'model_epoch_100.pth'
    
    print(f"Processing sketch: {input_path}")
    print(f"Output will be saved to: {output_path}")
    
    success = generate_and_save_image(input_path, output_path, model_path)
    
    if success:
        print("Sketch processing completed successfully")
        sys.exit(0)
    else:
        print("Sketch processing failed")
        sys.exit(1)
